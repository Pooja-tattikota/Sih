# Weather Intelligence & Risk Engine — Rules Documentation

This document explains exactly how the Risk Engine decides each risk level.
All decisions are based on fixed thresholds and official warning data —
there is no random or AI-guessed scoring involved.

## Rain Risk

| Condition | Risk Level |
|---|---|
| Rain probability > 70% **and** an official warning is active | HIGH |
| Rain probability > 70% **or** expected rainfall > 30mm | HIGH |
| Rain probability > 40% | MODERATE |
| Rain probability ≤ 40% | LOW |

## Flood / Severe-Weather Risk

Based on how much rain is expected, how likely it is, and whether an
official warning is active.

| Condition | Risk Level |
|---|---|
| Expected rainfall > 60mm **and** (rain probability > 70% **or** official warning active) | HIGH |
| Expected rainfall > 30mm **and** rain probability > 50% | MODERATE |
| Otherwise | LOW |

## Heat Risk

Based on how far today's temperature is above the historical average for
this time of year.

| Condition | Risk Level |
|---|---|
| 5°C or more above historical average | HIGH |
| 2°C to 5°C above historical average | MODERATE |
| Less than 2°C above historical average | LOW |

## Wind Risk

| Condition | Risk Level |
|---|---|
| Wind speed > 40 km/h | HIGH |
| Wind speed > 20 km/h | MODERATE |
| Wind speed ≤ 20 km/h | LOW |

## Overall Risk

Overall risk is simply the **highest** of the four individual risks
(rain, flood, heat, wind). For example, if rain risk is HIGH but the
others are LOW, the overall risk is still HIGH — the system doesn't
average risks down, since a single severe factor should not be hidden.

## Historical Comparison

The system compares today's temperature to the historical average for
the same time of year and reports the difference directly (e.g. "Today
is 4°C above the historical average"), so users can see how unusual
current conditions are.

## Sector-Specific Messages

The same risk data is reworded for different types of users:
- **Farmer** — framed around irrigation and field-work impact
- **Traveller** — framed around travel delays/disruption
- **Student** — framed around commuting impact

These are informational rewordings of the same risk levels, not
professional advice.

## Why This Approach

Every risk level is traceable back to a specific number or condition
(e.g. rain probability, wind speed, official warning status), so anyone
reviewing the system can see exactly why a given risk level was assigned.
