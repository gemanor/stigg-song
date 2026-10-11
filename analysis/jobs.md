# Scenario jobs log

Team `team_ihrqsYn2KPDAur5KUgkPZecZ` · project `proj_mKoqqV96CR4taCciuEQ35Hjm` · plan cu-basic (Starter: 2 parallel custom jobs)

| when | what | model | job | asset(s) | CU | notes |
|---|---|---|---|---|---|---|
| 2026-10-11 | song take A (seed 11) | elevenlabs-music-advanced-v2-5 | job_xxprxMwfXvVvCJ5zeTh1q5fB | asset_FhRJgGo5DQNh5aqd9JiJUnqw | 90 | v1 lyrics (pre-review), 140.04 s, exploratory only |
| 2026-10-11 | song take B (seed 2222) | elevenlabs-music-advanced-v2-5 | job_V3tZKTThMKJiZNdJhyjtLYTu | asset_z6BQhGWN1wVmhassyDB1QYwe | 90 | v1 lyrics, 140.04 s; auto-transcript: 'I'm a, I'm a founder', 'Go my selfies' |
| 2026-10-11 | song take C | lyria-3-5 | job_de7CoQCcdKgA1oFNYwHpxXbo | asset_DFxufVD5NMVbhsxCiMHvyQyQ | 16 | v1 lyrics, 150.1 s; transcript: 'explain' -> 'inflate' |
| 2026-10-11 | song take D/E | ace-step-1-5-quality | (429 plan limit) | | | retry when a slot frees |

Director asked (mid-run) to review lyrics before any song generation. Takes A-C are exploratory (sound only). Total so far: 196 CU.

## Round 2 (lyrics v3 approved, network open) — 2026-10-11
| what | model | job | asset(s) | CU | notes |
|---|---|---|---|---|---|
| song v3 EL beds (seed 303) | elevenlabs-music-advanced-v2-5 | job_SmauEfFbo93N2gP7VsHZ6xsT | asset_9Ev5Ke5LhpxdzqCx8hsXGCLm | 90 | skits as instrumental beds, 144.02 s |
| song v3 EL full (seed 404) | elevenlabs-music-advanced-v2-5 | job_17BPuGymvBpPwBBzAoaxm885 | asset_fCppqnFNXmxKDVrnVPHZQaGG | 90 | model performs skits, 144.02 s |
| song v3 Lyria | lyria-3-5 | job_TpYehghMJUQeHR1b54kjZecs | asset_SnHzyvPSgTthdrrVss3nWvS5 | 16 | 141.5 s |
| song v3 ACE-Step x2 | ace-step-1-5-quality | job_BnoD1zMLCupc6CCet46pmmRS | asset_AXienn8TMnwVVPYUGKWikQsD, asset_BNKrUdTRzB2X8gAYUMtdDLQD | 60 | 145.0 s |
| HIM sheet x2 | gpt-image-2-5-sunburst | job_oMPjzuV3Qsf9iTvVorptQgv1 | asset_izLVNo8UWqAnpPwxXDWQaxnc, **asset_jEr8bX8XwUSWJpKLEhxoLKjq (picked)** | 25 | 2048x1152 |
| HER sheet x2 | gpt-image-2-5-sunburst | job_aG7aVcpbN8pDwuQFkZzxA5do | **asset_YA5LAp8nvfeDzMsiUzrwStTx (picked)**, asset_aYh2QYhy2DwtQz13z2kYCjnr | 26 | style ref = HIM sheet |

### Reference assets (identity)
- HIM sheet asset_jEr8bX8XwUSWJpKLEhxoLKjq · HIM front crop asset_f56ULW38mdefcTbKSStDjLZi · HIM face crop asset_4BxStcwBSBwmDfMsAMgK3CLZ
- HER sheet asset_YA5LAp8nvfeDzMsiUzrwStTx · HER front crop asset_85EPc4FpCvABr72gFoszhHu8 · HER face crop asset_LBebiDxEovTojQScwGYdBv5R

## Round 3 — song repair + dialogue (2026-10-11)
| what | model | asset | CU |
|---|---|---|---|
| repair attempts with sung/spoken dialogue (failed: garbled) x2 | elevenlabs-music-extend-v2-5 | asset_B9ShLrbDQTzuGtk3NAJDdNT4, asset_zjB1VhgPfCrnW8REKPQe3mqh | 360 |
| instrumental-bed repaint x2 (2 more failed on 200-char line limit, refunded) | elevenlabs-music-extend-v2-5 | **asset_2C4ziGwAtp74LuXqDq3G4DbH (seed 1201, used)**, asset_KaHvPiRR4zpj2MDHavxKHTZn | 360 |
| voice auditions (Liam, Jessica, Will, Laura) | elevenlabs-tts-v4-turbo | asset_d4weedsvNRorfak9iumpx91g, asset_UuUpwpiW7oybFdCFKiDyfodR, asset_W83HKK2HsbQQHFB2kA14TXRf, asset_HVVbCGCL8qktvoRZieixXDoR | 32 |
| 15 dialogue lines (Liam/Jessica) | elevenlabs-tts-v4-turbo | see assets/vo/lines.json | 120 |
| party ambience 14 s | elevenlabs-sound-effects-v2 | asset_9J4YjGZ6xurHgFnvz8uqgsPr | 30 |
| 4 natural re-reads of the opening | elevenlabs-tts-v4-turbo | asset_wMyNa31hcP2wug8odorG8cME, asset_M8yz2pY1c2bGzEXo7LRCkRSg, asset_hVwGitXPEeeLvgNgQRHfiTXA, asset_idXRJkR9YsGSQPp2aBcPAzev | 32 |
| on-theme re-reads of the opening, 2 takes x 4 lines (C/D) | elevenlabs-tts-v4-turbo | C1 asset_QNB4ZrcXLVcXH66ZU95T8Bkt · D1 asset_tan6q3ydWeU4LV2LHSGH8FQA · C2 asset_ozAhDsv4wd7v9jXU4q3XtjzL · D2 asset_g28RL32mUDXjZJAtDVViowYb · C3 asset_vYpLakk6Ry1YMhVt9uijEXLG · D3 asset_mefAhF8rnzATWzWv5fCimZTh · C4 asset_qFRHmevZTwFPjQa5yVoukWGP · D4 asset_1sG6sKCSLK1oHrfAnsRRchbq | 64 |
| new closing scene, 2 takes x 2 lines ("who's paying for our date?" / "out of tokens") | elevenlabs-tts-v4-turbo | E1 asset_DRqqrvezvyGuDHejwSdrnw7w · **E3 asset_zAnTnJ8b34C3ZFYDhXh8ch8C (used)** · **E2 asset_KE4GFsua5QGunKSKrBVKeNe1 (used)** · E4 asset_mngtznRX2dzppjTR5H8NYrnX | 32 |

Running total ≈ 1,533 CU (song + dialogue 1,482 · characters 51). Master v4: intro C at tempo 1.06, new closing scene, 2:28.75.

Cross-check with the Scenario usage API (2026-10-11 15:05 UTC): project total 1,675.75 CU net of the 2 refunded extend jobs = this log's 1,533 + 142.75 CU from jobs not launched by this session (2026-10-06: music-v2-5 job_Dd1HEGr3bDEDddsM3WtufF1K 90, lyria-3-5 job_n55Znvu8DyPLQvG35578cuPA and job_bcLCUZvg1gttdedZUxwcnEfs 16 + 16, an assistant message 4.75; 2026-10-11 11:32: lyria-3-5 job_bR9fLUJb4dqQSJjMk2r8tJTR 16, a test run with the original draft lyrics).

### Video pricing (dry runs, Starter plan)
- GPT Image 2.5 Sunburst style frame 1536x864 high: 13 CU
- Gemini Omni 1.1 Flash img2video: 6 s 720p = 120 CU · 10 s 1080p = 200 CU (Starter OK)
- MiniMax H3 Max Turbo I2V: 6 s 768P = 48 CU (Starter OK)
- Seedance 2.5 / LTX lip-sync / MiniMax H3 / Wan 3.0 / Kling V3: Pro only
