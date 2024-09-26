;; mock-stx-token.clar
(define-fungible-token mock-stx)

(define-constant mint-limit u100000000000000000000) ;; 100 STX
(define-constant contract-owner tx-sender)

(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u403))
    (ft-transfer? mock-stx amount sender recipient)
  )
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u403))
    (ft-mint? mock-stx amount recipient)
  )
)

(define-public (public-mint)
  (let ((current-balance (ft-get-balance mock-stx tx-sender)))
    (asserts! (<= (+ current-balance mint-limit) mint-limit) (err u401))
    (ft-mint? mock-stx mint-limit tx-sender)
  )
)

(define-public (get-balance (account principal))
  (ok (ft-get-balance mock-stx account))
)

(define-public (get-total-supply)
  (ok (ft-get-supply mock-stx))
)

;; Events
(define-data-var last-event-id uint u0)

(define-private (emit-event (event-type (string-ascii 50)))
  (let
    ((event-id (+ (var-get last-event-id) u1)))
    (var-set last-event-id event-id)
    (print {event-id: event-id, event-type: event-type, token: "mock-stx"})
    (ok event-id)))

(define-public (transfer-event (amount uint) (sender principal) (recipient principal))
  (begin
    (try! (transfer amount sender recipient))
    (emit-event "transfer")
  )
)

(define-public (mint-event (amount uint) (recipient principal))
  (begin
    (try! (mint amount recipient))
    (emit-event "mint")
  )
)