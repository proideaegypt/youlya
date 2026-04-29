# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/playwright-youlya-scenarios.spec.ts >> Youlya AI Commerce OS scenarios (CONV) >> CONV-057
- Location: tests/playwright-youlya-scenarios.spec.ts:77:9

# Error details

```
Error: CONV-057 reply should include one of: هحولك لفريق الدعم | فريق الدعم

expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  82  | 
  83  |       const conversationId = uuid();
  84  |       const customerId = uuid();
  85  |       const providerMessageId = uuid();
  86  | 
  87  |       const tone =
  88  |         scenario.id === 'CONV-082'
  89  |           ? 'angry'
  90  |           : scenario.id === 'CONV-083'
  91  |             ? 'confused'
  92  |             : 'neutral';
  93  | 
  94  |       if (scenario.id === 'CONV-081') {
  95  |         setKillSwitchForStore(TEST_STORE_ID, true);
  96  |       }
  97  |       if (scenario.id === 'CONV-083') {
  98  |         // Required critical path: 3 unclear turns in same conversation should handoff.
  99  |         await request.post(`${APP_URL}/api/internal/messages/turn`, {
  100 |           headers: {
  101 |             'x-internal-secret': INTERNAL_API_SECRET as string,
  102 |           },
  103 |           data: {
  104 |             store_id: TEST_STORE_ID,
  105 |             conversation_id: conversationId,
  106 |             customer_id: customerId,
  107 |             channel: 'whatsapp_evolution',
  108 |             message_type: 'text',
  109 |             text: '؟؟',
  110 |             language: 'ar-EG',
  111 |             tone: 'confused',
  112 |             remote_jid: '201000000000@s.whatsapp.net',
  113 |             instance_name: 'YoulyaTest',
  114 |             provider_message_id: uuid(),
  115 |             _preconditions: scenario.preconditions ?? {},
  116 |           },
  117 |         });
  118 |         await request.post(`${APP_URL}/api/internal/messages/turn`, {
  119 |           headers: {
  120 |             'x-internal-secret': INTERNAL_API_SECRET as string,
  121 |           },
  122 |           data: {
  123 |             store_id: TEST_STORE_ID,
  124 |             conversation_id: conversationId,
  125 |             customer_id: customerId,
  126 |             channel: 'whatsapp_evolution',
  127 |             message_type: 'text',
  128 |             text: 'ممم',
  129 |             language: 'ar-EG',
  130 |             tone: 'confused',
  131 |             remote_jid: '201000000000@s.whatsapp.net',
  132 |             instance_name: 'YoulyaTest',
  133 |             provider_message_id: uuid(),
  134 |             _preconditions: scenario.preconditions ?? {},
  135 |           },
  136 |         });
  137 |       }
  138 |       const res = await request.post(`${APP_URL}/api/internal/messages/turn`, {
  139 |         headers: {
  140 |           'x-internal-secret': INTERNAL_API_SECRET as string,
  141 |         },
  142 |         data: {
  143 |           store_id: TEST_STORE_ID,
  144 |           conversation_id: conversationId,
  145 |           customer_id: customerId,
  146 |           channel: 'whatsapp_evolution',
  147 |           message_type: scenario.message_type,
  148 |           text: scenario.input,
  149 |           language: scenario.locale || 'ar-EG',
  150 |           tone,
  151 |           remote_jid: '201000000000@s.whatsapp.net',
  152 |           instance_name: 'YoulyaTest',
  153 |           provider_message_id: providerMessageId,
  154 |           _preconditions: scenario.preconditions ?? {},
  155 |         },
  156 |       });
  157 | 
  158 |       if (scenario.id === 'CONV-081') {
  159 |         setKillSwitchForStore(TEST_STORE_ID, false);
  160 |       }
  161 | 
  162 |       expect(res.status(), `HTTP status for ${scenario.id}`).toBeLessThan(500);
  163 | 
  164 |       const body = (await res.json()) as TurnResponse;
  165 | 
  166 |       expect(typeof body.reply, `${scenario.id} reply must be string`).toBe('string');
  167 |       expect(['ai_reply', 'product_results', 'order_created', 'handoff', 'error']).toContain(body.action);
  168 | 
  169 |       const expectedAction = scenario.expected.action;
  170 |       const expectedAny = scenario.expected.action_any;
  171 | 
  172 |       if (expectedAction) {
  173 |         expect(body.action, `${scenario.id} action`).toBe(expectedAction);
  174 |       } else if (expectedAny && expectedAny.length > 0) {
  175 |         expect(expectedAny, `${scenario.id} action_any`).toContain(body.action);
  176 |       }
  177 | 
  178 |       const fragments = scenario.expected.reply_contains_any ?? [];
  179 |       if (fragments.length > 0) {
  180 |         const reply = String(body.reply ?? '').toLowerCase();
  181 |         const matched = fragments.some((fragment) => reply.includes(fragment.toLowerCase()));
> 182 |         expect(matched, `${scenario.id} reply should include one of: ${fragments.join(' | ')}`).toBeTruthy();
      |                                                                                                 ^ Error: CONV-057 reply should include one of: هحولك لفريق الدعم | فريق الدعم
  183 |       }
  184 |     });
  185 |   }
  186 | });
  187 | 
```