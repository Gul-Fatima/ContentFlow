# Content list data contract

These list endpoints replace the demo data currently returned by
`src/services/content/contentService.ts`. All dates are ISO 8601 timestamps.

## `GET /approvals`

Returns an array of approval items:

```json
[
  {
    "id": "approval-id",
    "platform": "twitter",
    "scheduledFor": "2026-02-10T09:00:00.000Z",
    "scheduledLabel": "Tomorrow, 9:00 AM",
    "title": "Post title",
    "body": "Post body",
    "imageUrl": "https://example.com/image.png",
    "aiReasoning": "Why this content was generated",
    "tone": 92,
    "status": "pending",
    "author": "Agent"
  }
]
```

`platform` is `twitter`, `linkedin`, `instagram`, or `email`. `imageUrl`,
`aiReasoning`, `tone`, and `author` are optional. `status` is `pending`,
`approved`, or `rejected`.

## `GET /scheduled`

Returns an array of scheduled posts:

```json
[
  {
    "id": "post-id",
    "platform": "linkedin",
    "title": "Post title",
    "at": "2026-02-11T14:00:00.000Z",
    "status": "scheduled",
    "content": "Post body",
    "time": "2:00 PM",
    "day": 2,
    "hour": 14,
    "goalTag": "Product Launch"
  }
]
```

`platform` uses the same four values as approvals. `status` is `scheduled`
or `draft`. `day` is the weekday index from 0 (Monday) to 6 (Sunday), and
`hour` is 0–23. `time` and `goalTag` support the existing calendar views;
`goalTag` is optional.

## `GET /analytics/top-content`

Returns an array of top content rows:

```json
[
  {
    "id": "content-id",
    "title": "Remote Work Trends",
    "platform": "twitter",
    "views": 8200
  }
]
```

## `GET /brand/rules`

Returns an array of brand content rules:

```json
[
  {
    "id": "rule-id",
    "title": "Always use Oxford commas"
  }
]
```

## `GET /brand/personas`

Returns an array of audience personas:

```json
[
  {
    "name": "The Busy Founder",
    "role": "Startup CEO",
    "pain": "No time for consistency",
    "goals": "Efficiency, Scale, Automation"
  }
]
```
