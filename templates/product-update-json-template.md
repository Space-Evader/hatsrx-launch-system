# HatsRx Product Update JSON Template

Use this format for every existing Wix product that needs updated HatsRx content.

```json
{
  "match": {
    "productSlug": "",
    "productId": ""
  },
  "updates": {
    "finalName": "",
    "collection": "",
    "tags": [],
    "descriptionHtml": ""
  },
  "taxonomy": {
    "mood": [],
    "vibe": [],
    "fit": "",
    "colorEnergy": "",
    "occasion": [],
    "rxCollection": "",
    "subscriptionEligible": "",
    "bestsellerCandidate": ""
  },
  "quizMapping": {
    "moodTriggers": [],
    "vibeTriggers": [],
    "occasionTriggers": []
  },
  "review": {
    "status": "draft",
    "approvedBy": "",
    "approvedDate": ""
  }
}
```

## Rules

- Use productSlug during planning.
- Use productId before live automation.
- Do not include price, payment, shipping, subscription, fulfillment, or publishing fields.
- Do not create new products.
- Review JSON before any Wix update is attempted.
