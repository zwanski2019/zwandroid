from services.flipper_parser import parse_flipper_ir

router = APIRouter()

<

@router.post("/parse")
def parse_ir(body: dict):
    text = body.get("text", "")
    return {"signals": parse_flipper_ir(text)}
