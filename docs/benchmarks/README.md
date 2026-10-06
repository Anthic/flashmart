# Benchmarks

Rule: no optimization is accepted without numbers here.

## Process
1. Write k6 script in /scripts/k6/<name>.js
2. Run baseline BEFORE the change, save result
3. Apply ONE change
4. Run again, save result
5. Fill TEMPLATE.md, commit with the code

## Standard scenarios
| ID | Scenario | Load |
|---|---|---|
| B1 | Product list read | 500 VUs, 2 min |
| B2 | Product detail read | 1000 VUs, 2 min |
| B3 | Login | 100 VUs, 1 min |
| B4 | Create order (normal) | 200 VUs, 2 min |
| B5 | Flash-sale spike: 100 items, 10,000 buyers | ramp 0->10k in 10s |
| B6 | Soak test | 200 VUs, 30 min |
| B7 | Failure test: kill a service mid-load | |

## Index
| Date | Phase | Scenario | Change | p95 before | p95 after | RPS before | RPS after | Errors | File |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

## Machine note
Always record CPU, RAM, and Docker limits. Numbers only compare on the same machine.