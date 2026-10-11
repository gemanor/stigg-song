"""Shot list -> GPT Image 2.5 style-frame requests (analysis/shots.json). One 16:9 frame per shot, on a flat chroma-blue cyc.
usage: python3 analysis/shots.py   (prints the ids; the lead launches them two at a time on Scenario)"""
import json

HIM_SHEET, HIM_FRONT, HIM_FACE = 'asset_jEr8bX8XwUSWJpKLEhxoLKjq', 'asset_f56ULW38mdefcTbKSStDjLZi', 'asset_4BxStcwBSBwmDfMsAMgK3CLZ'
HER_SHEET, HER_FRONT, HER_FACE = 'asset_YA5LAp8nvfeDzMsiUzrwStTx', 'asset_85EPc4FpCvABr72gFoszhHu8', 'asset_LBebiDxEovTojQScwGYdBv5R'

HIM = ("the young San Francisco AI founder from the reference sheet (curly dark hair, beige baseball cap with the lowercase word "
       "'building' on the front, grey oversized hoodie with a small black stair-step logo on the chest, black lanyard with a white "
       "and light-blue conference badge, white wireless earbuds, black smart band, black joggers, white socks, chunky white sneakers)")
HER = ("the sharp young woman from the reference sheet (dark hair in a low messy bun with loose strands, gold hoop earrings, winged "
       "eyeliner, red lips and red nails, oversized black blazer with rolled sleeves, plain white t-shirt, wide black trousers, white sneakers)")
STYLE = ("Keep the exact faces, proportions, outfits and the exact same 2D cartoon art style as the reference sheets: clean confident "
         "black ink outlines, flat colours with soft cel shading, editorial cartoon look. Not 3D, not Pixar, not anime, not chibi, not photoreal.")
BG = ("Background: one perfectly flat, uniform chroma-key blue (#1E3CFF) filling the entire frame edge to edge. No floor line, no "
      "cast shadow, no gradient, no vignette, no texture, no environment. Even, flat studio light on the characters with no blue light spill.")
NOTEXT = "No text, no letters, no captions, no logos other than the word 'building' on his cap, no watermark, no other people."

S = {}
def shot(sid, refs, who, frame, action, extra=''):
    S[sid] = {'prompt': f"Use the reference images: {who}. {STYLE}\n\nShot: {frame}\n\nAction: {action}{(' ' + extra) if extra else ''}\n\n{BG}\n\n{NOTEXT}",
              'referenceImages': refs}

shot('party_wide', [HIM_SHEET, HER_SHEET, HIM_FRONT, HER_FRONT], f"two characters, {HER}, and {HIM}",
     "a medium-wide two-shot from the knees up. She stands on the left third, he stands on the right third, with clear empty space between them and generous headroom.",
     "she has just walked up to him with a flirty little smile and a small wave, holding an iced matcha latte in a clear cup with a green straw. "
     "He doesn't look up: he stares down at his phone (its screen lights his face), and absent-mindedly holds a lilac energy-drink can out toward her as if she were a waiter.")
shot('him_cu_talk', [HIM_SHEET, HIM_FACE, HIM_FRONT], HIM,
     "a medium close-up from the chest up, his face turned three-quarters toward the camera, framed on the right half with the left half empty for typography.",
     "deadpan, mid-sentence, explaining something he finds obvious: eyebrows slightly raised, eyes half-lidded and bored, mouth open on a word.")
shot('her_cu_talk', [HER_SHEET, HER_FACE, HER_FRONT], HER,
     "a medium close-up from the chest up, her face turned three-quarters toward the camera, framed on the left half with the right half empty for typography.",
     "skeptical and amused, mid-question: one eyebrow raised high, lips parted on a word, holding an iced matcha latte (clear cup, green straw) near her chin.")
shot('him_pitch', [HIM_SHEET, HIM_FRONT, HIM_FACE], HIM,
     "a medium-wide shot from the thighs up, standing on the left third and turned three-quarters toward the right. The right two thirds of the frame are empty (his slides will go there).",
     "pitching like it's demo day: one arm extended, palm open, presenting toward the empty right side; the other hand holds a small presentation clicker. Smug, confident, deadpan.")
shot('vc_plunge', [HIM_SHEET], "a NEW character in the same art style as the reference sheet: a middle-aged venture capitalist (fictional, not a real person), "
     "short grey hair, neat grey stubble, wearing a navy fleece vest over a blue button-down shirt",
     "a medium-wide shot, framed on the right two thirds, with the left third empty.",
     "he sits up to his chest in a round wooden cold-plunge tub full of ice water and floating ice cubes, still in his fleece vest, shivering hard, "
     "teeth chattering, frost on his eyebrows, signing a term sheet on a tablet with a stylus in a trembling hand. The tub is the only prop.")
shot('her_walkin_point', [HER_SHEET, HER_FRONT, HER_FACE], HER,
     "a full-body shot of her walking in from the left, framed on the left third, the whole body visible from head to sneakers with space under her feet. The right two thirds are empty.",
     "mid-stride, sipping an iced matcha latte (clear cup, green straw) through the straw, eyes sideways toward the empty right side, her other hand pointing at it, deeply unconvinced.")
shot('him_dance', [HIM_SHEET, HIM_FRONT, HIM_FACE], HIM,
     "a full-body shot, centered, the whole body visible from cap to sneakers with space under his feet and generous headroom.",
     "a stiff, deadpan little dance move: finger guns pointing straight at the camera, one knee bent, hips slightly popped, a smug half-smile, eyes half-lidded.")
shot('date_table', [HIM_SHEET, HER_SHEET, HIM_FRONT, HER_FRONT], f"two characters, {HER}, and {HIM}",
     "a medium-wide two-shot of them seated across a small round white cafe table on two simple light-wood chairs, seen from the side. She sits on the left, he sits on the right.",
     "a date. He talks with both hands, gesturing big as if explaining a world-changing startup; his lilac energy-drink can is on the table. "
     "She leans her chin on one hand, skeptical, an iced matcha latte (clear cup, green straw) in front of her.")
shot('her_rap', [HER_SHEET, HER_FRONT, HER_FACE], HER,
     "a medium shot from the waist up, framed on the left half with the right half empty for typography.",
     "rapping with attitude straight to the camera: counting points off on her fingers with one hand, holding an iced matcha (clear cup, green straw) in the other, a confident smirk, mouth open on a word.")
shot('him_idle_front', [HIM_SHEET, HIM_FRONT], HIM,
     "a full-body front view, centered, the whole body visible from cap to sneakers with space under his feet and generous headroom on both sides.",
     "standing straight facing the camera with both hands in his hoodie pocket, totally deadpan, chewing slightly (a nicotine pouch in his lip), like a mannequin modelling his own outfit.")
shot('her_mock_chant', [HER_SHEET, HER_FRONT, HER_FACE], HER,
     "a full-body shot framed slightly left of center, the whole body visible with space under her feet and generous headroom.",
     "mocking his stadium chant: one fist pumped up in a stiff, exaggerated imitation, mouth open in a fake bored shout, eyes rolled, holding her iced matcha (clear cup, green straw) in the other hand.")
shot('her_facepalm', [HER_SHEET, HER_FACE, HER_FRONT], HER,
     "a medium close-up from the chest up, centered, with headroom.",
     "she can't believe what she just heard: laughing helplessly behind one hand, eyes squeezed shut, shoulders shaking.")
shot('duo_dance', [HIM_SHEET, HER_SHEET, HIM_FRONT, HER_FRONT], f"two characters, {HIM}, and {HER}",
     "a wide full-body two-shot, both whole bodies visible from head to sneakers with space under their feet. He is on the left, she is on the right, with a little space between them.",
     "dancing side by side. He does his stiff, deadpan stadium fist pump; she does a mocking, exaggerated copy of it next to him with a sarcastic grin, her iced matcha in her other hand.")
shot('him_gottago', [HIM_SHEET, HIM_FRONT, HIM_FACE], HIM,
     "a medium shot from the waist up, framed on the right half with the left half empty.",
     "getting up to leave: half-turned away, finger guns over his shoulder, a smug wink, the lilac energy-drink can tucked under his arm.")
shot('her_whopays', [HER_SHEET, HER_FACE, HER_FRONT], HER,
     "a medium close-up from the chest up, seated, framed on the left half with the right half empty.",
     "one eyebrow raised, a sweet-but-dangerous smile, sliding a black restaurant bill folder across the table toward the right with two fingers.")
shot('him_outoftokens', [HIM_SHEET, HIM_FACE, HIM_FRONT], HIM,
     "a medium close-up from the chest up, centered, with headroom.",
     "caught: a frozen, awkward, forced smile, a drop of sweat on his temple, eyes darting sideways, one hand patting his empty hoodie pocket.")
shot('her_pays', [HER_SHEET, HER_FRONT, HER_FACE], HER,
     "a medium shot from the waist up, framed on the left half with the right half empty.",
     "unbothered and in control: handing her iced matcha (clear cup, green straw) off to the right with one hand (as if to someone off screen), "
     "while tapping her coral phone on a small black card-payment terminal with the other. A confident little smirk.")
shot('her_victory', [HER_SHEET, HER_FRONT, HER_FACE], HER,
     "a full-body shot, centered, the whole body visible with space under her feet and generous headroom.",
     "triumphant: a confident, energetic stadium fist pump straight up, mouth open in a proud shout, blazer swinging, no drink in her hands.")
shot('him_holds_matcha', [HIM_SHEET, HIM_FRONT, HIM_FACE], HIM,
     "a full-body shot framed on the right third, the whole body visible with space under his feet. The left two thirds are empty.",
     "holding her iced matcha latte (clear cup, green straw) in both hands in front of his chest like a trophy he didn't ask for, totally deadpan, a little sheepish.")

json.dump(S, open('analysis/shots.json', 'w'), indent=1)
print(len(S), list(S))
