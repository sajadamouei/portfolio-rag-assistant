---
id: ai-course-builder
title: AgoCourse - AI Course Builder Platform
source_type: industry_project
language: en
last_verified: 2026-08-08
repository_url:
paper_url:
portfolio_url: https://sajad.no/#projects
live_demo_url: https://www.agocourse.com/
---

# AgoCourse - AI Course Builder Platform

## Overview

AgoCourse is an AI-first platform for creating interactive, scenario-based training courses. It helps training teams turn a natural-language description into a structured course with scenes, learner decisions, branching paths, quizzes, and outcomes without requiring game engines or complex authoring tools.

The project was created to make realistic workplace training faster and easier to produce, especially for safety, technical procedures, compliance, onboarding, and other situations where learner decisions matter.

## Challenge

Creating realistic branching training is traditionally expensive and time-consuming. It often requires instructional designers, developers, media production, specialist authoring tools, and significant manual work to design and maintain every possible path.

The main challenge was to make this process simple enough for training managers and subject-matter experts while still supporting complex branching logic, AI-generated media, interactive scenes, and different learner outcomes.

## My contribution

As Co-founder and AI Engineer, I helped take AgoCourse from the initial idea to a working product.

My main contribution was designing the product experience: defining the pages, features, user flows, course creation workflow, and how AI should be integrated throughout the platform. I also researched, evaluated, selected, and iterated on the AI models used for course and media generation.

I led the full-stack developer during implementation, translating product and AI requirements into features and reviewing the platform as it developed.

My role focused on product design, AI direction, research, architecture, and technical leadership rather than full-stack implementation.

## Solution

We designed AgoCourse around an AI-assisted course creation workflow.

A creator describes a training scenario, provides relevant characters or reference materials, and the AI generates an initial course structure containing scenes, decisions, quizzes, evaluations, and branching outcomes.

The creator can then visually edit the generated flow, refine individual scenes, generate image or video content, and preview the experience from the learner's perspective.

The wider platform also supports learner management, course assignments, progress tracking, certificates, assets, and organization-level administration.

## Architecture

A simplified platform flow is:

User prompt + documents/assets + characters + AI model settings → AI course generation → branching course graph → scene and media generation → visual course builder → learner experience → progress tracking and certificates

The course itself is represented as connected nodes such as scenes, quizzes, evaluations, decisions, and completion states, allowing different learner actions to lead to different paths and outcomes.

The detailed AI-model architecture and individual model integrations are still evolving and will be documented more fully as the platform develops.

## Technologies

The main technology stack includes:

- Python for AI and backend-related functionality
- TypeScript, Next.js, and React for the web application
- Tailwind CSS for the interface
- LLMs for course and scenario generation
- Generative image and video models for scene creation
- Docker for containerization
- Nginx for serving and routing
- Azure for cloud infrastructure and AI services
- Git and GitHub for development and version control

## Hard parts

One of the hardest problems was turning a simple user prompt into a course that has a coherent branching structure rather than just generating isolated text.

Another challenge was evaluating AI models for different tasks and balancing generation quality, speed, cost, consistency, and controllability, particularly for generated images and videos.

From a product perspective, an important challenge was hiding this complexity behind an interface that training professionals could use without needing technical knowledge.

## Validation

AgoCourse is currently in the pilot customer testing phase. Selected organizations are using the platform and providing feedback on the course-building and learner experience before a wider launch.

The core platform is working and is being tested by real users creating and evaluating training experiences.

## Results

The project has progressed from an initial concept to a working web platform with a live public website and an active pilot program.

The system can transform training scenarios into structured branching course flows, support AI-generated scene media, provide course editing and learner experiences, and manage training functions such as assignments, progress, and certificates.

Since the product is still in the pilot phase, the current focus is on qualitative customer feedback rather than presenting unverified performance or business metrics.

## Limitations

The platform is still evolving, and some areas are not yet as mature as the core course creation experience.

Advanced analytics, marketplace functionality, super-admin tools, richer conditional logic, and parts of the tracking experience still need further development.

AI-generated media also introduces challenges around generation time, cost, consistency, and occasional outputs that require manual refinement.

## Trade-offs

We chose to make AI assist the creator rather than completely automate course creation.

This gives users more control and makes generated courses easier to review and refine, but it also means some manual editing is still necessary.

We also support different AI models instead of depending entirely on one provider. This gives us more flexibility around quality and cost, but increases the complexity of model evaluation and integration.

## Other components

AgoCourse includes several supporting components around the core AI course builder:

- Course and learner management for assignments and training administration
- Asset management for images, videos, documents, and reusable materials
- AI media generation for individual scenes
- Learner tracking and analytics for progress, attempts, scores, and completion
- Certificate management for completed training
- Role and permission management for organizations, creators, learners, and platform administrators
- Docker/Nginx-based deployment with cloud infrastructure on Azure

The platform is designed around multiple roles, including organization administrators, course creators, company learners, independent learners, and platform administrators.

## Lessons learned

One of my main lessons was that building an AI product is not primarily about choosing the most powerful model. The AI has to fit into a clear workflow and produce outputs that users can understand, control, and improve.

I also learned a lot about balancing AI capabilities, product design, technical feasibility, cost, and user experience while leading development from an early idea to a product that real customers can test.

Working closely with a full-stack developer also strengthened my ability to translate AI and product concepts into clear technical requirements.

## Future improvements

The next step is to use pilot feedback to improve the course creation workflow and make generated courses more consistent and easier to refine.

We also plan to improve AI-assisted editing, model selection, media consistency, learner analytics, tracking, marketplace functionality, and administration tools.

Longer term, the goal is for AI to support more of the complete course lifecycle, including scenario design, content and media generation, analytics, recommendations, reporting, and continuous improvement of existing courses.