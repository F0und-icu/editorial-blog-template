# The price of time.

A bond is often described as a promise. That is useful, but incomplete. It is a sequence of promised payments with dates attached. The dates matter because a dollar delivered next year cannot be used today, and because the alternatives available to an investor change over time.

This essay uses a hypothetical five-year bond with a face value of $1,000 and an annual coupon of $40. Payments arrive at the end of each year. There are no taxes, transaction costs, defaults, or early redemption features. Those assumptions make the arithmetic visible; they do not describe every bond an investor might encounter.

## Start with the cash flows

Our bond pays $40 in each of the first four years. In year five it pays $1,040: the final coupon plus principal. To value those payments, we discount each one at a required annual yield. A payment further away receives a larger discount because the money remains unavailable for longer.

When the required yield is 4%, the price is exactly $1,000. That is not a universal rule about bonds. It follows from this particular bond having a coupon rate equal to its required yield, with consistent annual compounding and payment frequency.

| Required yield | Approximate price | Change from par |
| --- | ---: | ---: |
| 3% | $1,045.80 | +4.58% |
| 4% | $1,000.00 | 0.00% |
| 5% | $956.71 | −4.33% |
| 6% | $915.75 | −8.43% |

The payments have not changed. Their price has changed because an investor can now compare them with a different set of opportunities. If newly available bonds offer a higher yield for equivalent risk and timing, an older low-coupon bond generally needs a lower price to remain competitive.

![Five-year bond price at required yields from 2% to 7%. Hypothetical annual cash flows, not market observations.](/images/editorial/bond-price.svg)

## Duration is a sensitivity, not a deadline

Maturity tells us when the final payment arrives. Duration describes the timing-weighted exposure of a bond's value to yield changes. For this bond at a 4% yield, Macaulay duration is approximately 4.63 years and modified duration is approximately 4.45.

A common first approximation says that a one-percentage-point rise in yield produces a price decline of roughly 4.45%. The exact decline from 4% to 5% in the table is about 4.33%. The difference is not an error: duration is a local, linear approximation to a curved relationship.

> A precise number can still be an approximation. Its usefulness depends on knowing what has been held constant.

For larger yield moves, the curvature of the price-yield relationship matters more. Credit spreads, embedded options, and changes in the shape of the yield curve can also make a single duration number insufficient. A portfolio is rarely exposed to one interest rate moving in isolation.

## Make the calculation inspectable

A small function is enough to reproduce the example. Here, `yield_rate` is a decimal, payments are annual, and the principal is repaid only at maturity. Changing a payment convention without changing the function would change the meaning of the result.

```python
def bond_price(yield_rate, years=5, face=1000, coupon=40):
    coupons = sum(
        coupon / (1 + yield_rate) ** year
        for year in range(1, years + 1)
    )
    principal = face / (1 + yield_rate) ** years
    return coupons + principal

for rate in (0.03, 0.04, 0.05, 0.06):
    print(f"{rate:.0%}: ${bond_price(rate):,.2f}")
```

The model is deliberately small. It explains a mechanism rather than producing a trade. A real valuation would require the actual payment schedule, day-count convention, settlement date, issuer risk, and possibly separate discount rates for different maturities.

## Holding to maturity changes the question

If the issuer makes every payment and the investor never needs to sell, the contractual cash flows are fixed. That does not eliminate economic risk. Inflation can reduce the purchasing power of the principal. Coupon payments may need to be reinvested at less attractive rates. An unexpected expense may force an earlier sale.

The useful question is therefore not simply whether a bond is safe. It is which obligation the bond is intended to fund, on what date, and under which conditions a sale might become necessary. Matching a known liability can be more relevant than minimizing every fluctuation in a quoted market price.

## Read the rate, then read the assumptions

A yield compresses many facts into one number. Before comparing two yields, ask whether their payment timing, currency, credit quality, tax treatment, and option features are comparable. Similar labels do not guarantee similar exposures.

For background, the [SEC's introduction to bonds](https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds) explains core bond terminology. The figures above are independently calculated examples; they are not taken from a live data feed. Their purpose is to make the price of waiting easier to see.
