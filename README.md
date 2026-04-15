# ZwanDroid

> Software Flipper Zero — runs in your browser on Android Chrome.

Built with React (Vite PWA) + FastAPI + official Flipper Zero open-source assets.

## Features

| Module | Technology | Status |
|---|---|---|
| NFC | Web NFC API | Chrome Android |
| IR | Web Serial + Flipper IR DB (12k+ codes) | USB IR blaster |
| Bluetooth | Web Bluetooth | Chrome |
| Bad USB | DuckyScript + WebUSB HID | USB OTG |
| Sub-GHz | WebUSB RTL-SDR | Dongle required |
| Signal DB | LocalStorage + Flipper .ir/.nfc/.sub export | All platforms |

## Credits

IR and signal assets from [Flipper Zero Firmware](https://github.com/flipperdevices/flipperzero-firmware)
and [Flipper IRDB](https://github.com/UberGuidoZ/Flipper-IRDB) (MIT / CC licenses).

## Dev

```bash
docker-compose up
```

Frontend: http://localhost:5173
Backend: http://localhost:8000/docs

