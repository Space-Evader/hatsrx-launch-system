# HatsRx Tagging Schema (v1)

## Purpose

This system organizes all HatsRx products, quiz results, and collections.

It powers:
- the Dr. HatsRx quiz
- product recommendations
- collections
- future AI stylist

---

## Core Tag Categories (Required for Every Hat)

### Mood
Describes how the wearer feels.

Allowed values:
- bold
- confident
- focused
- creative
- chill
- mysterious
- rebellious

---

### Vibe
Describes how the wearer presents.

Allowed values:
- street
- clean
- artistic
- luxe
- stealth
- loud
- minimal

---

### Fit
Hat type.

Allowed values:
- snapback
- dad-hat
- trucker
- fitted
- bucket

---

### Color Energy
Color feel, not just color.

Allowed values:
- neutral
- bright
- earth
- monochrome
- cool

---

### Occasion
Where it is worn.

Allowed values:
- everyday
- night-out
- work
- travel
- event
- content

---

### Rx Collection
Primary grouping system.

Allowed values:
- confidence-rx
- focus-rx
- creative-flow-rx
- stealth-mode-rx
- bold-energy-rx
- chill-rx

---

### Subscription Eligible
Whether included in Monthly Rx Club.

Allowed values:
- yes
- no

---

### Bestseller Candidate
Internal flag for testing.

Allowed values:
- yes
- no

---

## Example Product Tagging

Midnight Signal Snapback

- Mood: focused, mysterious
- Vibe: clean, stealth
- Fit: snapback
- Color: neutral
- Occasion: everyday, night-out
- Rx Collection: stealth-mode-rx
- Subscription Eligible: yes
- Bestseller Candidate: yes

---

## Rules

1. Every product must have ALL categories filled.
2. Do not invent new values unless approved.
3. Keep tags simple and reusable.
4. One primary Rx Collection per product.
5. Multiple moods and occasions are allowed.

---

## Purpose Reminder

These tags power:

Mood → Quiz → Recommendation → Product → Purchase

This is the core HatsRx system.
