# Ibda' — AI Social Media Marketing Agent

**Ibda'** is an AI-powered social media marketing agent designed to help businesses manage their social media marketing workflow in one place.

It helps users move from a **marketing goal** to **content creation, review, scheduling, and performance analysis**, while keeping the brand's identity and target audience in context.

---

## The Idea

Social media marketing involves more than simply generating posts.

A marketing team needs to:

* Decide what they want to achieve
* Understand their target audience
* Maintain a consistent brand voice
* Create relevant content
* Review content before publishing
* Keep track of scheduled posts
* Understand how their content performs

Ibda' brings these activities together and uses AI to assist throughout the process.

```text
              MARKETING GOAL
                    │
                    ▼
             ┌─────────────┐
             │    PLAN     │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │   CREATE    │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │   REVIEW    │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │   SCHEDULE  │
             └──────┬──────┘
                    │
                    ▼
             ┌─────────────┐
             │   ANALYZE   │
             └─────────────┘
```

---

# What Can Ibda' Do?

## 🎯 Set Marketing Goals

Users can define what they want to achieve through their social media marketing.

For example:

> **Increase awareness of our new product among university students.**

The agent uses the goal as the starting point for planning the marketing activity.

---

## 🧠 Remember the Brand

Every brand has its own identity.

Ibda' allows users to provide information about their brand so that the AI can take it into account when assisting with marketing tasks.

This can include:

* Brand voice
* Tone
* Product information
* Brand guidelines
* Existing brand documents

Instead of treating every request as a completely new conversation, Ibda' maintains a **brand memory** that can be reused throughout the marketing workflow.

```text
                  BRAND
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     Voice       Products     Guidelines
       │            │            │
       └────────────┼────────────┘
                    ▼
              BRAND MEMORY
                    │
                    ▼
             AI assistance
```

---

## 👥 Understand the Audience

Different audiences require different types of communication.

Users can define audience personas that describe the people they want to reach.

```text
                    AUDIENCE
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Students     Developers    Businesses
          │            │            │
          ▼            ▼            ▼
       Different communication styles
```

The selected audience can then be considered when planning and creating content.

---

## ✍️ Create Content with AI

Ibda' helps generate social media content based on the marketing context.

The AI can consider:

```text
       Marketing Goal
              +
         Brand Identity
              +
        Target Audience
              +
        Relevant Knowledge
              │
              ▼
        AI CONTENT
```

This means the generated content is intended to be relevant to the **specific marketing situation**, rather than being completely generic.

---

# 🔎 Brand Knowledge

Ibda' can use information supplied by the user to answer questions and assist with content.

For example, a business could provide a product document containing information about its features, pricing, or positioning.

When the user asks a question, Ibda' can find the relevant information from the stored knowledge and use it when generating the response.

```text
        Brand Information
               │
               ▼
        ┌──────────────┐
        │ Brand Memory │
        └──────┬───────┘
               │
               │
        User asks a question
               │
               ▼
        Relevant information
               │
               ▼
             AI
               │
               ▼
        Grounded response
```

This helps the AI work with the **business's own information** instead of relying only on general knowledge.

---

# ✅ Human Approval

Ibda' is designed to keep the user involved in the content workflow.

AI-generated content can be reviewed before it moves forward.

```text
                 AI
                 │
                 ▼
              Draft
                 │
                 ▼
              Review
             /      \
            /        \
       Approve       Reject
          │             │
          ▼             ▼
       Continue       Revise
```

The AI assists with content creation; the user remains responsible for the final content decision.

---

# 📅 Content Scheduling

Approved content can be organized into a publishing schedule.

The scheduler gives users a centralized view of planned content and helps them manage when content should be published.

```text
       Content Ideas
             │
             ▼
          Drafts
             │
             ▼
          Approval
             │
             ▼
          Schedule
             │
             ▼
          Publish
```

---

# 📊 Analytics

Ibda' provides an analytics area where users can view the performance of their social media activity.

The purpose is to help users understand what is happening with their content and use those insights when planning future marketing activity.

```text
       Published Content
              │
              ▼
          Performance
              │
              ▼
           Analytics
              │
              ▼
       Future Decisions
```

---

# How Ibda' Fits Together

The main components work together as one marketing workflow.

```text
                         ┌───────────────┐
                         │     USER      │
                         └───────┬───────┘
                                 │
                  ┌──────────────┼──────────────┐
                  │              │              │
                  ▼              ▼              ▼
              Marketing       Brand         Audience
                Goals         Memory         Personas
                  │              │              │
                  └──────────────┼──────────────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │   AI AGENT    │
                         └───────┬───────┘
                                 │
                                 ▼
                         Content Creation
                                 │
                                 ▼
                            Approval
                                 │
                                 ▼
                           Scheduling
                                 │
                                 ▼
                            Analytics
                                 │
                                 └──────────────┐
                                                │
                                                ▼
                                         Future Planning
```

---

# High-Level Architecture

Ibda' consists of three main parts:

```text
┌─────────────────────────────────────────────┐
│                  USER                       │
│                                             │
│          Mobile App / Web App               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│                IBDA' AGENT                  │
│                                             │
│       Marketing Workflow + AI               │
│                                             │
│   Goals · Content · Personas · Approval     │
│   Scheduling · Analytics · Brand Memory     │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│             KNOWLEDGE & DATA                │
│                                             │
│       Brand Information + Application       │
│                  Data                       │
└─────────────────────────────────────────────┘
```

The user interacts with Ibda' through the application, while the agent coordinates the marketing workflow and uses the available brand and audience information to provide context-aware assistance.

---

# Main Features

| Feature               | Purpose                                           |
| --------------------- | ------------------------------------------------- |
| **Marketing Goals**   | Define what the marketing activity should achieve |
| **AI Agent**          | Assist with planning and content creation         |
| **Brand Memory**      | Keep brand information available to the AI        |
| **Audience Personas** | Define and understand target audiences            |
| **AI Content**        | Generate context-aware social media content       |
| **Approval**          | Review AI-generated content before continuing     |
| **Scheduler**         | Organize planned content                          |
| **Analytics**         | Understand content performance                    |

---

# Platforms

Ibda' is designed as a universal application that can be used across:

```text
             ┌──────────────┐
             │    IBDA'     │
             └──────┬───────┘
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
        iOS      Android      Web
```

The goal is to provide the same core marketing experience across platforms.

---

# Technology

Ibda' is built using modern web, mobile, backend, and AI technologies.

**Frontend**

* Expo
* React Native
* TypeScript
* NativeWind

**Backend**

* Django
* Django REST Framework

**AI**

* Google Gemini
* Retrieval-Augmented Generation (RAG)

**Data**

* PostgreSQL
* Vector-based knowledge storage

---

# Project Vision

Ibda' aims to evolve into a complete **AI workspace for social media marketing**.

The central idea is simple:

> **Give the AI the goal, the brand, and the audience — then let it assist with the marketing workflow while keeping the human in control.**

```text
       GOAL
        │
        ▼
      PLAN
        │
        ▼
     CREATE
        │
        ▼
     REVIEW
        │
        ▼
    SCHEDULE
        │
        ▼
     ANALYZE
        │
        └──────────────► IMPROVE
```

---

## Project Status

🚧 **Ibda' is currently under active development.**

The core application interface and initial AI/brand-memory workflow are being developed as the foundation for the complete marketing agent.

For the detailed development plan and technical implementation details, see **[`plan.md`](plan.md)**.
#   I b d a -  
 