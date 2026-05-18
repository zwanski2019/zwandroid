from __future__ import annotations

import asyncio

from fastapi import APIRouter, WebSocket

router = APIRouter()


@router.websocket("/ws/scan")
async def subghz_scan(websocket: WebSocket):
    """
    WebSocket relay for RTL-SDR scanning when WebUSB is unavailable.
    Client connects, sends { freq: 433920000, samples: 1024 }
    Server streams back IQ samples as base64 chunks.
    """
    await websocket.accept()
    try:
        import base64

        import numpy as np
        import rtlsdr

        sdr = rtlsdr.RtlSdr()
        data = await websocket.receive_json()
        freq = int(data.get("freq", 433_920_000))
        num_samples = int(data.get("samples", 1024))
        sdr.sample_rate = 2.4e6
        sdr.center_freq = freq
        sdr.gain = "auto"
        while True:
            samples = sdr.read_samples(num_samples)
            raw = base64.b64encode(samples.astype(np.complex64).tobytes()).decode()
            await websocket.send_json({"samples": raw, "freq": freq})
            await asyncio.sleep(0.1)
    except ImportError:
        await websocket.send_json({"error": "rtlsdr not installed — pip install pyrtlsdr"})
    except Exception as e:
        await websocket.send_json({"error": str(e)})
    finally:
