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
