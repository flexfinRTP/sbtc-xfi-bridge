;; sbtc-bridge contract

(use-trait ft-trait .sip-010-trait.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))
(define-constant err-transfer-failed (err u102))
(define-constant err-invalid-price (err u103))
(define-constant err-invalid-amount (err u104))
(define-constant err-invalid-withdrawal (err u105))

;; Data variables
(define-data-var bridge-reserve uint u0)
(define-data-var sbtc-price uint u0)
(define-data-var xfi-price uint u0)

;; Data maps
(define-map user-balances principal uint)
(define-map pending-withdrawals { txid: (buff 32) } { amount: uint, recipient: principal })

;; Read-only functions
(define-read-only (get-balance (user principal))
  (default-to u0 (map-get? user-balances user))
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

;; Public functions
(define-public (deposit (token <ft-trait>) (amount uint))
  (let
    (
      (user-balance (get-balance tx-sender))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender) none))
    (map-set user-balances tx-sender (+ user-balance amount))
    (var-set bridge-reserve (+ (var-get bridge-reserve) amount))
    (ok true)
  )
)

(define-public (withdraw (token <ft-trait>) (amount uint))
  (let
    (
      (user-balance (get-balance tx-sender))
      (bridge-balance (var-get bridge-reserve))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= user-balance amount) err-not-enough-balance)
    (asserts! (>= bridge-balance amount) err-not-enough-balance)
    (try! (as-contract (contract-call? token transfer amount tx-sender tx-sender none)))
    (var-set bridge-reserve (- bridge-balance amount))
    (map-set user-balances tx-sender (- user-balance amount))
    (ok true)
  )
)

(define-public (initiate-crosschain-transfer (amount uint) (recipient (buff 32)))
  (let
    (
      (user-balance (get-balance tx-sender))
      (txid (unwrap! (get-block-info? id-header-hash (- block-height u1)) (err u106)))
    )
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (>= user-balance amount) err-not-enough-balance)
    (map-set user-balances tx-sender (- user-balance amount))
    (map-set pending-withdrawals { txid: txid } { amount: amount, recipient: tx-sender })
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

(define-public (update-prices (new-sbtc-price uint) (new-xfi-price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-sbtc-price u0) err-invalid-price)
    (asserts! (> new-xfi-price u0) err-invalid-price)
    (var-set sbtc-price new-sbtc-price)
    (var-set xfi-price new-xfi-price)
    (ok true)
  )
)

(define-public (confirm-crosschain-transfer (txid (buff 32)))
  (let
    (
      (withdrawal (unwrap! (map-get? pending-withdrawals { txid: txid }) err-invalid-withdrawal))
    )
    (map-delete pending-withdrawals { txid: txid })
    (map-set user-balances (get recipient withdrawal) (+ (get-balance (get recipient withdrawal)) (get amount withdrawal)))
    (ok true)
  )
)