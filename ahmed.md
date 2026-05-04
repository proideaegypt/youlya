

TASK:
conversation-history-and-human-handoff-dashboard

GOAL:
Persist all inbound/outbound messages and create a staff-visible conversation timeline plus human handoff queue.

BUILD:
- message history logging
- conversations list
- timeline view
- handoff center
- AI pause per conversation
- return to AI
- resolve handoff
- internal notes

DO NOT:
- Do not expose secrets.
- Do not expose full PII by default.
- Do not let AI reply during handoff.
- Do not create orders.

TABLES:
conversations
messages
conversation_events
handoff_tickets or extend existing

UI:
/dashboard/conversations
/dashboard/handoff

TESTS:
- inbound/outbound persisted
- customer identifiers masked
- handoff pauses AI
- return to AI resumes
- no secrets in API

FINAL RESPONSE:
STATUS:
TASK:
SCHEMA:
LOGGING:
CONVERSATIONS UI:
HANDOFF UI:
TESTS:
NEXT STEP:





TASK:
haidi-lab-and-approved-learning-pipeline

GOAL:
Create dashboard lab for testing Haidi scenarios and approving learning suggestions. This prepares for tomorrow’s message scenarios and future RAG.

BUILD:
/dashboard/haidi/lab
/dashboard/haidi/learning

FEATURES:
- scenario list
- add scenario
- expected intent/tone/must_include/must_not_include
- run scenario
- compare actual vs expected
- score reply
- create learning suggestion
- approve/reject learning
- published knowledge version placeholder

RULE:
No automatic self-learning into production.
Only approved suggestions can be published later.

TESTS:
- scenario CRUD
- run scenario safe
- scoring
- approval queue
- no PII/secrets

FINAL RESPONSE:
STATUS:
TASK:
HAIDI LAB:
LEARNING:
APPROVAL:
TESTS:
NEXT STEP:


