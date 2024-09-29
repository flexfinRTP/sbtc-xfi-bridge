(use-trait ft-trait .sip-010-trait.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))
(define-constant err-transfer-failed (err u102))
(define-constant err-invalid-price (err u103))
(define-constant err-invalid-amount (err u104))
(define-constant err-invalid-withdrawal (err u105))
(define-constant err-invalid-recipient (err u106))
(define-constant err-invalid-token (err u107))

;; Data variables
(define-data-var bridge-reserve uint u0)
(define-data-var sbtc-price uint u0)
(define-data-var xfi-price uint u0)
(define-data-var stx-price uint u0)

;; Data maps
(define-map user-balances { user: principal, token: principal } uint)
(define-map pending-withdrawals { txid: (buff 32) } { amount: uint, recipient: principal, token: principal })

;; Read-only functions
(define-read-only (get-balance (user principal) (token <ft-trait>))
  (default-to u0 (map-get? user-balances { user: user, token: (contract-of token) }))
)

(define-read-only (get-reserve)
  (var-get bridge-reserve)
)

(define-read-only (get-sbtc-price)
  (var-get sbtc-price)
)

(define-read-only (get-xfi-price)
  (var-get xfi-price)
)

(define-read-only (get-stx-price)
  (var-get stx-price)
)

;; Public functions
(define-public (deposit (token <ft-trait>) (amount uint))
  (let
    (
      (user-balance (get-balance tx-sender token))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender) none))
    (map-set user-balances { user: tx-sender, token: (contract-of token) } (+ user-balance amount))
    (var-set bridge-reserve (+ (var-get bridge-reserve) amount))
    (ok true)
  )
)

(define-public (withdraw (token <ft-trait>) (amount uint))
  (let
    (
      (user-balance (get-balance tx-sender token))
      (bridge-balance (var-get bridge-reserve))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= user-balance amount) err-not-enough-balance)
    (asserts! (>= bridge-balance amount) err-not-enough-balance)
    (try! (as-contract (contract-call? token transfer amount tx-sender tx-sender none)))
    (var-set bridge-reserve (- bridge-balance amount))
    (map-set user-balances { user: tx-sender, token: (contract-of token) } (- user-balance amount))
    (ok true)
  )
)

(define-public (initiate-crosschain-transfer (token <ft-trait>) (amount uint) (recipient (buff 32)))
  (let
    (
      (user-balance (get-balance tx-sender token))
      (txid (unwrap! (get-block-info? id-header-hash (- block-height u1)) err-invalid-withdrawal))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= user-balance amount) err-not-enough-balance)
    (asserts! (is-valid-recipient recipient) err-invalid-recipient)
    (map-set user-balances { user: tx-sender, token: (contract-of token) } (- user-balance amount))
    (map-set pending-withdrawals { txid: txid } { amount: amount, recipient: tx-sender, token: (contract-of token) })
    (ok txid)
  )
)

;; Admin functions
(define-public (update-bridge-reserve (new-reserve uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set bridge-reserve new-reserve)
    (ok true)
  )
)

(define-public (update-prices (new-sbtc-price uint) (new-xfi-price uint) (new-stx-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-sbtc-price u0) err-invalid-price)
    (asserts! (> new-xfi-price u0) err-invalid-price)
    (asserts! (> new-stx-price u0) err-invalid-price)
    (var-set sbtc-price new-sbtc-price)
    (var-set xfi-price new-xfi-price)
    (var-set stx-price new-stx-price)
    (ok true)
  )
)

(define-public (confirm-crosschain-transfer (txid (buff 32)))
  (let
    (
      (withdrawal (unwrap! (map-get? pending-withdrawals { txid: txid }) err-invalid-withdrawal))
    )
    (map-delete pending-withdrawals { txid: txid })
    (map-set user-balances 
      { user: (get recipient withdrawal), token: (get token withdrawal) } 
      (+ (get-balance (get recipient withdrawal) (unwrap! (contract-call? .token-registry get-token (get token withdrawal)) err-invalid-token)) 
         (get amount withdrawal))
    )
    (ok true)
  )
)

;; Helper functions
(define-private (is-valid-recipient (recipient (buff 32)))
  (is-eq (len recipient) u32)
)