"""
Weather Intelligence & Risk Engine

This is a Rough draft,thresholds are placeholders and should be
refined with real historical/official data later.
"""

import json


def calculate_risk(weather_data):
    """
    Takes weather + warning data and returns a risk report.

    Expected input (weather_data) as a dict, e.g.:
    {
        "rain_probability": 80,       # percent (0-100)
        "expected_rainfall_mm": 45,   # millimeters
        "wind_speed_kmh": 20,         # km/h
        "temperature_c": 38,          # current temp in Celsius
        "historical_avg_temp_c": 34,  # average temp for this time of year
        "official_warning": True      # True/False from Person 2's data
    }

    Returns a dict shaped like:
    {
        "rain_risk": "HIGH",
        "flood_risk": "MODERATE",
        "heat_risk": "MODERATE",
        "wind_risk": "LOW",
        "overall_risk": "HIGH",
        "reasons": [...],
        "historical_comparison": {...}
    }
    """

    reasons = []

    # ---- Rain risk ----
    rain_probability = weather_data.get("rain_probability", 0)
    expected_rainfall_mm = weather_data.get("expected_rainfall_mm", 0)
    official_warning = weather_data.get("official_warning", False)

    if rain_probability > 70 and official_warning:
        rain_risk = "HIGH"
        reasons.append(
            f"Rain probability is {rain_probability}% and an official warning is active."
        )
    elif rain_probability > 70 or expected_rainfall_mm > 30:
        rain_risk = "HIGH"
        reasons.append(
            f"Rain probability is {rain_probability}% with {expected_rainfall_mm}mm expected rainfall."
        )
    elif rain_probability > 40:
        rain_risk = "MODERATE"
        reasons.append(f"Rain probability is {rain_probability}%.")
    else:
        rain_risk = "LOW"
        reasons.append(f"Rain probability is only {rain_probability}%.")

    # ---- Heat risk ----
    temperature_c = weather_data.get("temperature_c", 0)
    historical_avg_temp_c = weather_data.get("historical_avg_temp_c", temperature_c)
    temp_diff = temperature_c - historical_avg_temp_c

    if temp_diff >= 5:
        heat_risk = "HIGH"
        reasons.append(
            f"Temperature is {temp_diff}°C above the historical average ({historical_avg_temp_c}°C)."
        )
    elif temp_diff >= 2:
        heat_risk = "MODERATE"
        reasons.append(
            f"Temperature is {temp_diff}°C above the historical average ({historical_avg_temp_c}°C)."
        )
    else:
        heat_risk = "LOW"
        reasons.append("Temperature is close to the historical average.")

    # ---- Wind risk ----
    wind_speed_kmh = weather_data.get("wind_speed_kmh", 0)

    if wind_speed_kmh > 40:
        wind_risk = "HIGH"
        reasons.append(f"Wind speed is {wind_speed_kmh} km/h.")
    elif wind_speed_kmh > 20:
        wind_risk = "MODERATE"
        reasons.append(f"Wind speed is {wind_speed_kmh} km/h.")
    else:
        wind_risk = "LOW"
        reasons.append(f"Wind speed is {wind_speed_kmh} km/h, within normal range.")

    # ---- Flood / severe-weather risk ----
    # Based on how much rain is expected, how likely it is, and whether
    # an official warning is active.
    if expected_rainfall_mm > 60 and (rain_probability > 70 or official_warning):
        flood_risk = "HIGH"
        reasons.append(
            f"Flood risk is HIGH: {expected_rainfall_mm}mm of rainfall expected "
            f"with {rain_probability}% probability"
            + (" and an official warning active." if official_warning else ".")
        )
    elif expected_rainfall_mm > 30 and rain_probability > 50:
        flood_risk = "MODERATE"
        reasons.append(
            f"Flood risk is MODERATE: {expected_rainfall_mm}mm of rainfall expected "
            f"with {rain_probability}% probability."
        )
    else:
        flood_risk = "LOW"
        reasons.append("Flood risk is LOW: rainfall is not expected to be heavy enough to cause flooding.")

    # ---- Overall risk ----
    # Overall = the highest of the four individual risks.
    risk_order = {"LOW": 0, "MODERATE": 1, "HIGH": 2}
    overall_risk = max(
        [rain_risk, flood_risk, heat_risk, wind_risk], key=lambda r: risk_order[r]
    )

    # ---- Historical comparison (Past vs Present) ----
    # Pulled out as its own clearly-labeled section, not just buried in reasons.
    historical_comparison = {
        "historical_avg_temp_c": historical_avg_temp_c,
        "today_temp_c": temperature_c,
        "difference_c": round(temp_diff, 1),
        "summary": (
            f"Today is {round(temp_diff, 1)}°C above the historical average"
            if temp_diff > 0
            else f"Today is {round(abs(temp_diff), 1)}°C below the historical average"
            if temp_diff < 0
            else "Today matches the historical average"
        ),
    }

    return {
        "rain_risk": rain_risk,
        "flood_risk": flood_risk,
        "heat_risk": heat_risk,
        "wind_risk": wind_risk,
        "overall_risk": overall_risk,
        "reasons": reasons,
        "historical_comparison": historical_comparison,
    }


def get_sector_message(risk_report, sector):
    """
    Takes the risk report (the dict returned by calculate_risk) and a
    sector name ("farmer", "traveller", or "student"), and returns a
    plain-English message worded for that audience.

    This does NOT give professional advice — it just rewords the same
    risk info for who's asking, as the project brief requires.
    """

    rain_risk = risk_report["rain_risk"]
    overall_risk = risk_report["overall_risk"]

    sector = sector.lower()

    if sector == "farmer":
        if rain_risk == "HIGH":
            return "Heavy rain is likely — this may affect irrigation timing and field work planning."
        elif rain_risk == "MODERATE":
            return "Some rain is expected — you may want to keep an eye on irrigation plans."
        else:
            return "Low rain risk — no major impact expected on irrigation or field work."

    elif sector == "traveller":
        if overall_risk == "HIGH":
            return "Weather conditions may significantly affect travel — delays or disruptions are possible."
        elif overall_risk == "MODERATE":
            return "Weather conditions may cause minor travel delays."
        else:
            return "Weather looks favorable for travel."

    elif sector == "student":
        if rain_risk == "HIGH":
            return "Heavy rainfall may affect your commute — consider leaving earlier or checking transport updates."
        elif rain_risk == "MODERATE":
            return "There's a moderate chance of rain — carrying an umbrella might help with your commute."
        else:
            return "No major weather concerns expected for your commute."

    else:
        return "Unknown sector requested. Supported sectors: farmer, traveller, student."


# ---- Example usage ----
# Below are THREE different fake examples, so you can see the function
# giving different results depending on what's fed into it. In the real
# project, Person 2's data will replace these examples.
if __name__ == "__main__":

    example_stormy_day = {
        "rain_probability": 80,
        "expected_rainfall_mm": 45,
        "wind_speed_kmh": 20,
        "temperature_c": 38,
        "historical_avg_temp_c": 34,
        "official_warning": True,
    }

    example_calm_day = {
        "rain_probability": 10,
        "expected_rainfall_mm": 0,
        "wind_speed_kmh": 8,
        "temperature_c": 30,
        "historical_avg_temp_c": 29,
        "official_warning": False,
    }

    example_windy_moderate_day = {
        "rain_probability": 50,
        "expected_rainfall_mm": 15,
        "wind_speed_kmh": 35,
        "temperature_c": 33,
        "historical_avg_temp_c": 31,
        "official_warning": False,
    }

    example_extreme_rain_day = {
        "rain_probability": 90,
        "expected_rainfall_mm": 90,
        "wind_speed_kmh": 30,
        "temperature_c": 28,
        "historical_avg_temp_c": 30,
        "official_warning": True,
    }

    all_examples = {
        "Stormy day": example_stormy_day,
        "Calm day": example_calm_day,
        "Windy moderate day": example_windy_moderate_day,
        "Extreme rain day": example_extreme_rain_day,
    }

    for label, weather_data in all_examples.items():
        print(f"--- {label} ---")
        result = calculate_risk(weather_data)
        print(json.dumps(result, indent=2))
        print()

    # ---- Sector-specific messages, shown using the stormy day example ----
    print("--- Sector-specific messages (Stormy day example) ---")
    stormy_result = calculate_risk(example_stormy_day)
    for sector in ["farmer", "traveller", "student"]:
        message = get_sector_message(stormy_result, sector)
        print(f"{sector.capitalize()}: {message}")