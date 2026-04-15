from __future__ import annotations


def parse_flipper_nfc(content: str) -> dict:
    data: dict[str, str] = {}
    for line in content.splitlines():
        if ": " in line:
            key, val = line.split(": ", 1)
            data[key.strip()] = val.strip()
    return data


def parse_flipper_ir(content: str) -> list[dict]:
    signals: list[dict[str, str]] = []
    current: dict[str, str] = {}
    for line0 in content.splitlines():
        line = line0.strip()
        if line.startswith("#") or not line:
            if current:
                signals.append(current)
                current = {}
            continue
        if ": " in line:
            key, val = line.split(": ", 1)
            current[key.strip()] = val.strip()
    if current:
        signals.append(current)
    return signals


def parse_flipper_subghz(content: str) -> dict:
    data: dict[str, str | list[int]] = {}
    raw_data: list[int] = []
    for line0 in content.splitlines():
        line = line0.strip()
        if line.startswith("RAW_Data:"):
            raw_data.extend(map(int, line.split(": ", 1)[1].split()))
        elif ": " in line:
            key, val = line.split(": ", 1)
            data[key.strip()] = val.strip()
    data["raw_data"] = raw_data
    return data

