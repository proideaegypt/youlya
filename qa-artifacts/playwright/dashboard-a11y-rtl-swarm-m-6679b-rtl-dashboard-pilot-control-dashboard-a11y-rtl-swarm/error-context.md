# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-a11y-rtl-swarm.spec.ts >> mobile >> a11y/rtl /dashboard/pilot-control
- Location: tests/playwright/dashboard-a11y-rtl-swarm.spec.ts:18:11

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - complementary "Primary navigation" [ref=e7]:
      - generic [ref=e9]:
        - generic "YOULYA HOME WEAR logo" [ref=e11]:
          - img "YOULYA HOME WEAR logo" [ref=e12]
        - generic [ref=e13]: YOULYA
      - navigation [ref=e14]:
        - list [ref=e15]:
          - listitem [ref=e16]:
            - link "لوحة التحكم" [ref=e17] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e18]
              - generic [ref=e23]: لوحة التحكم
          - listitem [ref=e24]:
            - link "الرسائل" [ref=e25] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e26]
              - generic [ref=e28]: الرسائل
          - listitem [ref=e29]:
            - link "الطلبات" [ref=e30] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e31]
              - generic [ref=e34]: الطلبات
          - listitem [ref=e35]:
            - link "المنتجات والمخزون" [ref=e36] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e37]
              - generic [ref=e41]: المنتجات والمخزون
          - listitem [ref=e42]:
            - link "ذكاء المنتجات" [ref=e43] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e44]
              - generic [ref=e52]: ذكاء المنتجات
          - listitem [ref=e53]:
            - link "التحويل البشري" [ref=e54] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e55]
              - generic [ref=e57]: التحويل البشري
          - listitem [ref=e58]:
            - link "المحادثات" [ref=e59] [cursor=pointer]:
              - /url: /dashboard/conversations
              - img [ref=e60]
              - generic [ref=e62]: المحادثات
          - listitem [ref=e63]:
            - link "الإحصائيات" [ref=e64] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e65]
              - generic [ref=e67]: الإحصائيات
          - listitem [ref=e68]:
            - link "القنوات" [ref=e69] [cursor=pointer]:
              - /url: /dashboard/settings/channels
              - img [ref=e70]
              - generic [ref=e73]: القنوات
          - listitem [ref=e74]:
            - link "AI Agent" [ref=e75] [cursor=pointer]:
              - /url: /dashboard/settings/ai-agent
              - img [ref=e76]
              - generic [ref=e79]: AI Agent
          - listitem [ref=e80]:
            - link "الشحن" [ref=e81] [cursor=pointer]:
              - /url: /dashboard/settings/shipping
              - img [ref=e82]
              - generic [ref=e87]: الشحن
          - listitem [ref=e88]:
            - link "المستخدمين والأدوار" [ref=e89] [cursor=pointer]:
              - /url: /dashboard/settings/users
              - img [ref=e90]
              - generic [ref=e95]: المستخدمين والأدوار
          - listitem [ref=e96]:
            - link "السجلات" [ref=e97] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e98]
              - generic [ref=e101]: السجلات
          - listitem [ref=e102]:
            - link "الملف الشخصي" [ref=e103] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e104]
              - generic [ref=e107]: الملف الشخصي
          - listitem [ref=e108]:
            - link "الإعدادات" [ref=e109] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e110]
              - generic [ref=e113]: الإعدادات
          - listitem [ref=e114]:
            - link "غرفة التحكم التجريبي" [ref=e115] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e116]
              - generic [ref=e118]: غرفة التحكم التجريبي
          - listitem [ref=e119]:
            - link "مختبر Haidi" [ref=e120] [cursor=pointer]:
              - /url: /dashboard/haidi/lab
              - img [ref=e121]
              - generic [ref=e123]: مختبر Haidi
          - listitem [ref=e124]:
            - link "تعلم Haidi" [ref=e125] [cursor=pointer]:
              - /url: /dashboard/haidi/learning
              - img [ref=e126]
              - generic [ref=e134]: تعلم Haidi
          - listitem [ref=e135]:
            - link "إعدادات Haidi" [ref=e136] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e137]
              - generic [ref=e140]: إعدادات Haidi
          - listitem [ref=e141]:
            - link "الأمان" [ref=e142] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e143]
              - generic [ref=e145]: الأمان
          - listitem [ref=e146]:
            - link "الأجهزة" [ref=e147] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e148]
              - generic [ref=e151]: الأجهزة
      - generic [ref=e152]:
        - generic [ref=e154]:
          - img [ref=e155]
          - paragraph [ref=e158]: متجر ذكي مدعوم بالذكاء الاصطناعي
        - button "تسجيل الخروج" [ref=e159]:
          - img [ref=e160]
          - generic [ref=e163]: تسجيل الخروج
    - main [ref=e164]:
      - generic [ref=e166]:
        - button "Open menu" [ref=e167]:
          - img [ref=e168]
        - generic [ref=e170]:
          - img [ref=e172]
          - textbox "Search" [ref=e175]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e176]:
          - button "Open notifications" [ref=e177]:
            - img [ref=e178]
            - generic [ref=e181]: Open notifications
            - generic [ref=e182]: "1"
          - button "Open settings" [ref=e183]:
            - img [ref=e184]
            - generic [ref=e187]: Open settings
          - button "Open user menu" [ref=e188]:
            - generic [ref=e190]: YH
            - generic [ref=e191]: Open user menu
      - generic [ref=e193]:
        - generic [ref=e195]:
          - generic [ref=e196]:
            - img [ref=e197]
            - text: Pilot control room
          - generic [ref=e199]:
            - heading "غرفة الطيار للواتساب" [level=1] [ref=e200]
            - paragraph [ref=e201]: متابعة health، n8n، Evolution، آخر الرسائل، وعدّادات الحماية قبل تشغيل التجربة اليدوية الآمنة.
          - generic [ref=e202]:
            - generic [ref=e203]: Kill switch OFF
            - generic [ref=e204]: n8n active
            - generic [ref=e205]: Evolution connected
            - generic [ref=e206]: live-ready
        - generic [ref=e207]:
          - generic [ref=e208]:
            - generic [ref=e209]:
              - img [ref=e210]
              - text: Date filters
            - button "Today" [ref=e211]
            - button "This week" [ref=e212]
            - button "This month" [ref=e213]
          - generic [ref=e214]:
            - generic [ref=e215]:
              - generic [ref=e216]: From
              - textbox [ref=e217]: 2026-05-06
            - generic [ref=e218]:
              - generic [ref=e219]: To
              - textbox [ref=e220]: 2026-05-06
            - button "Apply" [ref=e221]:
              - img [ref=e222]
              - text: Apply
            - button "Reset" [ref=e224]:
              - img [ref=e225]
              - text: Reset
        - generic [ref=e228]:
          - generic [ref=e230]:
            - generic [ref=e231]:
              - paragraph [ref=e232]: الصحة العامة
              - paragraph [ref=e233]: ok · ok · ok
              - paragraph [ref=e234]: "App: https://admin.nex-lnk.online"
            - img [ref=e236]
          - generic [ref=e239]:
            - generic [ref=e240]:
              - paragraph [ref=e241]: Kill switch
              - paragraph [ref=e242]: "OFF"
              - paragraph [ref=e243]: يجب أن يبقى OFF أثناء التجربة
            - img [ref=e245]
          - generic [ref=e248]:
            - generic [ref=e249]:
              - paragraph [ref=e250]: Dead letters
              - paragraph [ref=e251]: "0"
              - paragraph [ref=e252]: رسائل فشل بحاجة مراجعة
            - img [ref=e254]
          - generic [ref=e257]:
            - generic [ref=e258]:
              - paragraph [ref=e259]: Handoffs
              - paragraph [ref=e260]: "7"
              - paragraph [ref=e261]: تحويلات بشرية مفتوحة
            - img [ref=e263]
        - generic [ref=e267]:
          - button "Export" [ref=e268]:
            - img [ref=e269]
            - text: Export
            - img [ref=e272]
          - generic:
            - generic:
              - generic:
                - paragraph: Youlya Report
                - heading "Pilot control report" [level=1]
                - generic:
                  - paragraph: "Page: pilot-control"
                  - paragraph: "Preset: today"
                  - paragraph: "From: 2026-05-06"
                  - paragraph: "To: 2026-05-06"
                  - paragraph: "Generated at: 2026-05-06T13:48:59.589Z"
                  - paragraph: "App version: 2.23.4"
              - generic:
                - generic:
                  - paragraph: Inbound
                  - paragraph: "10"
                - generic:
                  - paragraph: Outbound
                  - paragraph: "10"
                - generic:
                  - paragraph: Handoffs
                  - paragraph: "7"
              - table:
                - rowgroup:
                  - row "Conversation Channel Body Created At":
                    - columnheader "Conversation"
                    - columnheader "Channel"
                    - columnheader "Body"
                    - columnheader "Created At"
                - rowgroup:
                  - row "20****et whatsapp_evolution هاي 2026-05-06T12:45:37.567+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "هاي"
                    - cell "2026-05-06T12:45:37.567+00:00"
                  - row "20****et whatsapp_evolution عايز اشوف البوركيني ؟ 2026-05-06T12:42:50.934+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "عايز اشوف البوركيني ؟"
                    - cell "2026-05-06T12:42:50.934+00:00"
                  - row "20****et whatsapp_evolution هاي 2026-05-06T04:29:34.107+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "هاي"
                    - cell "2026-05-06T04:29:34.107+00:00"
                  - row "20****et whatsapp_evolution hi 2026-05-06T04:25:43.591+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "hi"
                    - cell "2026-05-06T04:25:43.591+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:04.756+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:04.756+00:00"
                  - row "un****wn whatsapp_evolution — 2026-05-06T03:51:03.688+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "—"
                    - cell "2026-05-06T03:51:03.688+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:02.22+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:02.22+00:00"
                  - row "un****wn whatsapp_evolution — 2026-05-06T03:51:01.007+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "—"
                    - cell "2026-05-06T03:51:01.007+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:00.636+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:00.636+00:00"
                  - row "un****wn whatsapp_evolution — 2026-05-06T03:50:59.994+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "—"
                    - cell "2026-05-06T03:50:59.994+00:00"
                  - row "20****et whatsapp_evolution طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت. 2026-05-06T12:45:38.684+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت."
                    - cell "2026-05-06T12:45:38.684+00:00"
                  - row "20****et whatsapp_evolution طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت. 2026-05-06T12:42:52.254+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت."
                    - cell "2026-05-06T12:42:52.254+00:00"
                  - row "20****et whatsapp_evolution طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت. 2026-05-06T04:29:36.941+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت."
                    - cell "2026-05-06T04:29:36.941+00:00"
                  - row "20****et whatsapp_evolution ممكن توضحي أكثر؟ 2026-05-06T04:25:46.61+00:00":
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - cell "ممكن توضحي أكثر؟"
                    - cell "2026-05-06T04:25:46.61+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:05.602+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:05.602+00:00"
                  - row "un****wn whatsapp_evolution ممكن توضحي أكثر؟ 2026-05-06T03:51:04.888+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "ممكن توضحي أكثر؟"
                    - cell "2026-05-06T03:51:04.888+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:04.72+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:04.72+00:00"
                  - row "un****wn whatsapp_evolution ممكن توضحي أكثر؟ 2026-05-06T03:51:03.632+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "ممكن توضحي أكثر؟"
                    - cell "2026-05-06T03:51:03.632+00:00"
                  - 'row "20****et whatsapp_evolution اختاري المقاس المناسب: S / M / L / XL. 2026-05-06T03:51:02.249+00:00"':
                    - cell "20****et"
                    - cell "whatsapp_evolution"
                    - 'cell "اختاري المقاس المناسب: S / M / L / XL."'
                    - cell "2026-05-06T03:51:02.249+00:00"
                  - row "un****wn whatsapp_evolution ممكن توضحي أكثر؟ 2026-05-06T03:51:01.209+00:00":
                    - cell "un****wn"
                    - cell "whatsapp_evolution"
                    - cell "ممكن توضحي أكثر؟"
                    - cell "2026-05-06T03:51:01.209+00:00"
        - generic [ref=e274]:
          - generic [ref=e275]:
            - generic [ref=e276]:
              - img [ref=e277]
              - heading "Build Identity" [level=2] [ref=e280]
            - generic [ref=e281]:
              - generic [ref=e282]:
                - generic [ref=e283]: Version
                - generic [ref=e284]: 2.23.4
              - generic [ref=e285]:
                - generic [ref=e286]: Version Name
                - generic [ref=e287]: normalize-production-domain-and-fix-critical-launch-blockers
              - generic [ref=e288]:
                - generic [ref=e289]: Commit
                - generic [ref=e290]: unknown
              - generic [ref=e291]:
                - generic [ref=e292]: Built
                - generic [ref=e293]: ٦‏/٥‏/٢٠٢٦ ٧:٥٥:٢٦ ص
          - generic [ref=e294]:
            - generic [ref=e295]:
              - img [ref=e296]
              - heading "Workflow & safety" [level=2] [ref=e300]
            - generic [ref=e301]:
              - generic [ref=e302]:
                - generic [ref=e303]: n8n workflow
                - generic [ref=e304]: Active
              - generic [ref=e305]:
                - generic [ref=e306]: Evolution
                - generic [ref=e307]: Connected
              - generic [ref=e308]:
                - generic [ref=e309]: Shopify last sync
                - generic [ref=e310]: ٣‏/٥‏/٢٠٢٦ ٨:٤٩:٣٢ م
              - generic [ref=e311]:
                - generic [ref=e312]: Duplicate blocks
                - generic [ref=e313]: "0"
          - generic [ref=e314]:
            - generic [ref=e315]:
              - img [ref=e316]
              - heading "Safety blockers" [level=2] [ref=e319]
            - list [ref=e320]:
              - listitem [ref=e321]: Owner live order approval required
        - generic [ref=e322]:
          - generic [ref=e323]:
            - img [ref=e324]
            - heading "Pilot Actions" [level=2] [ref=e326]
          - generic [ref=e327]:
            - button "إيقاف Haidi" [ref=e328]:
              - img [ref=e329]
              - generic [ref=e332]: إيقاف Haidi
            - button "إيقاف الطلبات" [ref=e333]:
              - img [ref=e334]
              - generic [ref=e337]: إيقاف الطلبات
            - button "فتح Products Search QA" [ref=e338]:
              - img [ref=e339]
              - generic [ref=e342]: فتح Products Search QA
            - button "فتح Handoff Center" [ref=e343]:
              - img [ref=e344]
              - generic [ref=e346]: فتح Handoff Center
          - generic [ref=e347]:
            - link "Health API" [ref=e348] [cursor=pointer]:
              - /url: /api/health
              - img [ref=e349]
              - generic [ref=e353]: Health API
            - link "Haidi Settings" [ref=e354] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e355]
              - generic [ref=e358]: Haidi Settings
              - img [ref=e359]
        - generic [ref=e361]:
          - generic [ref=e362]:
            - generic [ref=e363]:
              - img [ref=e364]
              - heading "آخر 10 inbound messages" [level=2] [ref=e366]
            - list [ref=e367]:
              - listitem [ref=e368]:
                - generic [ref=e369]:
                  - generic [ref=e370]:
                    - generic [ref=e371]: whatsapp_evolution
                    - generic [ref=e372]: ٦‏/٥‏/٢٠٢٦ ٣:٤٥:٣٧ م
                  - generic [ref=e373]: Conversation 2011···.net
                - paragraph [ref=e374]: هاي
              - listitem [ref=e375]:
                - generic [ref=e376]:
                  - generic [ref=e377]:
                    - generic [ref=e378]: whatsapp_evolution
                    - generic [ref=e379]: ٦‏/٥‏/٢٠٢٦ ٣:٤٢:٥٠ م
                  - generic [ref=e380]: Conversation 2011···.net
                - paragraph [ref=e381]: عايز اشوف البوركيني ؟
              - listitem [ref=e382]:
                - generic [ref=e383]:
                  - generic [ref=e384]:
                    - generic [ref=e385]: whatsapp_evolution
                    - generic [ref=e386]: ٦‏/٥‏/٢٠٢٦ ٧:٢٩:٣٤ ص
                  - generic [ref=e387]: Conversation 2011···.net
                - paragraph [ref=e388]: هاي
              - listitem [ref=e389]:
                - generic [ref=e390]:
                  - generic [ref=e391]:
                    - generic [ref=e392]: whatsapp_evolution
                    - generic [ref=e393]: ٦‏/٥‏/٢٠٢٦ ٧:٢٥:٤٣ ص
                  - generic [ref=e394]: Conversation 2010···.net
                - paragraph [ref=e395]: hi
              - listitem [ref=e396]:
                - generic [ref=e397]:
                  - generic [ref=e398]:
                    - generic [ref=e399]: whatsapp_evolution
                    - generic [ref=e400]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e401]: Conversation 2011···.net
                - paragraph [ref=e402]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e403]:
                - generic [ref=e404]:
                  - generic [ref=e405]:
                    - generic [ref=e406]: whatsapp_evolution
                    - generic [ref=e407]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٣ ص
                  - generic [ref=e408]: Conversation unknown
                - paragraph [ref=e409]: —
              - listitem [ref=e410]:
                - generic [ref=e411]:
                  - generic [ref=e412]:
                    - generic [ref=e413]: whatsapp_evolution
                    - generic [ref=e414]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٢ ص
                  - generic [ref=e415]: Conversation 2011···.net
                - paragraph [ref=e416]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e417]:
                - generic [ref=e418]:
                  - generic [ref=e419]:
                    - generic [ref=e420]: whatsapp_evolution
                    - generic [ref=e421]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠١ ص
                  - generic [ref=e422]: Conversation unknown
                - paragraph [ref=e423]: —
              - listitem [ref=e424]:
                - generic [ref=e425]:
                  - generic [ref=e426]:
                    - generic [ref=e427]: whatsapp_evolution
                    - generic [ref=e428]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٠ ص
                  - generic [ref=e429]: Conversation 2011···.net
                - paragraph [ref=e430]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e431]:
                - generic [ref=e432]:
                  - generic [ref=e433]:
                    - generic [ref=e434]: whatsapp_evolution
                    - generic [ref=e435]: ٦‏/٥‏/٢٠٢٦ ٦:٥٠:٥٩ ص
                  - generic [ref=e436]: Conversation unknown
                - paragraph [ref=e437]: —
          - generic [ref=e438]:
            - generic [ref=e439]:
              - img [ref=e440]
              - heading "آخر 10 outbound messages" [level=2] [ref=e443]
            - list [ref=e444]:
              - listitem [ref=e445]:
                - generic [ref=e446]:
                  - generic [ref=e447]:
                    - generic [ref=e448]: whatsapp_evolution
                    - generic [ref=e449]: ٦‏/٥‏/٢٠٢٦ ٣:٤٥:٣٨ م
                  - generic [ref=e450]: Conversation 2011···.net
                - paragraph [ref=e451]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e452]:
                - generic [ref=e453]:
                  - generic [ref=e454]:
                    - generic [ref=e455]: whatsapp_evolution
                    - generic [ref=e456]: ٦‏/٥‏/٢٠٢٦ ٣:٤٢:٥٢ م
                  - generic [ref=e457]: Conversation 2011···.net
                - paragraph [ref=e458]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e459]:
                - generic [ref=e460]:
                  - generic [ref=e461]:
                    - generic [ref=e462]: whatsapp_evolution
                    - generic [ref=e463]: ٦‏/٥‏/٢٠٢٦ ٧:٢٩:٣٦ ص
                  - generic [ref=e464]: Conversation 2011···.net
                - paragraph [ref=e465]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e466]:
                - generic [ref=e467]:
                  - generic [ref=e468]:
                    - generic [ref=e469]: whatsapp_evolution
                    - generic [ref=e470]: ٦‏/٥‏/٢٠٢٦ ٧:٢٥:٤٦ ص
                  - generic [ref=e471]: Conversation 2010···.net
                - paragraph [ref=e472]: ممكن توضحي أكثر؟
              - listitem [ref=e473]:
                - generic [ref=e474]:
                  - generic [ref=e475]:
                    - generic [ref=e476]: whatsapp_evolution
                    - generic [ref=e477]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٥ ص
                  - generic [ref=e478]: Conversation 2011···.net
                - paragraph [ref=e479]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e480]:
                - generic [ref=e481]:
                  - generic [ref=e482]:
                    - generic [ref=e483]: whatsapp_evolution
                    - generic [ref=e484]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e485]: Conversation unknown
                - paragraph [ref=e486]: ممكن توضحي أكثر؟
              - listitem [ref=e487]:
                - generic [ref=e488]:
                  - generic [ref=e489]:
                    - generic [ref=e490]: whatsapp_evolution
                    - generic [ref=e491]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e492]: Conversation 2011···.net
                - paragraph [ref=e493]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e494]:
                - generic [ref=e495]:
                  - generic [ref=e496]:
                    - generic [ref=e497]: whatsapp_evolution
                    - generic [ref=e498]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٣ ص
                  - generic [ref=e499]: Conversation unknown
                - paragraph [ref=e500]: ممكن توضحي أكثر؟
              - listitem [ref=e501]:
                - generic [ref=e502]:
                  - generic [ref=e503]:
                    - generic [ref=e504]: whatsapp_evolution
                    - generic [ref=e505]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٢ ص
                  - generic [ref=e506]: Conversation 2011···.net
                - paragraph [ref=e507]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e508]:
                - generic [ref=e509]:
                  - generic [ref=e510]:
                    - generic [ref=e511]: whatsapp_evolution
                    - generic [ref=e512]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠١ ص
                  - generic [ref=e513]: Conversation unknown
                - paragraph [ref=e514]: ممكن توضحي أكثر؟
        - generic [ref=e515]:
          - generic [ref=e516]:
            - img [ref=e517]
            - heading "Synthetic Webhook Test" [level=2] [ref=e521]
          - generic [ref=e522]:
            - paragraph [ref=e523]: "Send a safe synthetic message to verify the loop without real WhatsApp:"
            - generic [ref=e524]: "curl -X POST https://admin.nex-lnk.online/webhook/youlya-whatsapp \\ -H \"Content-Type: application/json\" \\ -d '{\"data\":{\"key\":{\"remoteJid\":\"201000000000@s.whatsapp.net\",\"fromMe\":false},\"message\":{\"conversation\":\"هاي\"},\"messageTimestamp\":$(date +%s)}}'"
            - paragraph [ref=e525]: "Expected: HTTP 200, workflow execution created, no real message sent to customer."
      - paragraph [ref=e527]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e528]
```

# Test source

```ts
  1  | import path from "node:path";
  2  | import { test, expect } from "@playwright/test";
  3  | import { ensureDir, taskRoot } from "./helpers";
  4  | 
  5  | const pages = ["/dashboard/command-center", "/dashboard/pilot-control", "/dashboard/handoff", "/dashboard/inbox", "/dashboard/products", "/dashboard/products-intelligence", "/dashboard/statistics", "/dashboard/security", "/dashboard/devices", "/dashboard/profile", "/dashboard/orders", "/dashboard/logs", "/dashboard/settings"];
  6  | 
  7  | const viewports = [
  8  |   { name: "desktop", size: { width: 1440, height: 900 } },
  9  |   { name: "tablet", size: { width: 768, height: 1024 } },
  10 |   { name: "mobile", size: { width: 390, height: 844 } },
  11 | ];
  12 | 
  13 | for (const viewport of viewports) {
  14 |   test.describe(viewport.name, () => {
  15 |     test.use({ viewport: viewport.size });
  16 | 
  17 |     for (const route of pages) {
  18 |       test(`a11y/rtl ${route}`, async ({ page }) => {
  19 |         await page.goto(route, { waitUntil: "domcontentloaded" });
  20 |         await page.waitForLoadState("networkidle");
  21 | 
  22 |         const primaryNavigation = page.locator('aside[aria-label="Primary navigation"]');
  23 |         const openMenuButton = page.getByRole("button", { name: "Open menu" }).first();
  24 |         const sidebarToggle = page.getByRole("button", { name: /Collapse sidebar|Expand sidebar/ }).first();
  25 | 
  26 |         if (!(await primaryNavigation.isVisible().catch(() => false))) {
  27 |           if (await openMenuButton.isVisible().catch(() => false)) {
  28 |             await openMenuButton.click();
  29 |             await expect(primaryNavigation).toBeVisible();
  30 |           } else if (await sidebarToggle.isVisible().catch(() => false)) {
  31 |             await sidebarToggle.click();
  32 |             await expect(primaryNavigation).toBeVisible();
  33 |           }
  34 |         }
  35 | 
  36 |         const screenshotDir = path.join(taskRoot(), "a11y", "screenshots", viewport.name);
  37 |         await ensureDir(screenshotDir);
  38 |         await page.screenshot({
  39 |           path: path.join(screenshotDir, `${route.replaceAll("/", "_").replace(/^_/, "")}.png`),
  40 |           fullPage: true,
  41 |         });
  42 | 
  43 |         const dir = await page.evaluate(() => document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "");
  44 |         const navVisible = await primaryNavigation.isVisible().catch(() => false);
  45 |         const navToggleVisible =
  46 |           (await openMenuButton.isVisible().catch(() => false)) ||
  47 |           (await sidebarToggle.isVisible().catch(() => false));
  48 | 
  49 |         expect(navVisible || navToggleVisible, "Navigation should be visible or reachable").toBe(true);
  50 |         expect(["", "rtl", "ltr"]).toContain(dir);
  51 | 
  52 |         const unlabeledInputs = await page
  53 |           .locator("input, textarea, select")
  54 |           .evaluateAll((nodes) => {
  55 |             return nodes.filter((node) => {
  56 |               const element = node as HTMLInputElement;
  57 |               const hasAria = Boolean(element.getAttribute("aria-label") || element.getAttribute("aria-labelledby"));
  58 |               const id = element.id;
  59 |               const hasLabel = id ? Boolean(document.querySelector(`label[for='${id}']`)) : false;
  60 |               return !hasAria && !hasLabel;
  61 |             }).length;
  62 |           });
> 63 |         expect(unlabeledInputs).toBe(0);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  64 | 
  65 |         const unnamedButtons = await page
  66 |           .locator("button")
  67 |           .evaluateAll((nodes) =>
  68 |             nodes.filter((n) => {
  69 |               const el = n as HTMLButtonElement;
  70 |               const hasText = !!(el.innerText || "").trim();
  71 |               const hasAriaLabel = !!el.getAttribute("aria-label")?.trim();
  72 |               return !hasText && !hasAriaLabel;
  73 |             }).length
  74 |           );
  75 |         expect(unnamedButtons).toBe(0);
  76 | 
  77 |         const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth > 20);
  78 |         expect(hasHorizontalOverflow, "Mobile/tablet layout overflow >20px").toBe(false);
  79 |       });
  80 |     }
  81 |   });
  82 | }
  83 | 
```