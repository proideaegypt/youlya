# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard-a11y-rtl-swarm.spec.ts >> desktop >> a11y/rtl /dashboard/pilot-control
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
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic "YOULYA HOME WEAR logo" [ref=e11]:
            - img "YOULYA HOME WEAR logo" [ref=e12]
          - generic [ref=e13]: YOULYA
        - button "Collapse sidebar" [ref=e14]:
          - img [ref=e15]
      - navigation [ref=e17]:
        - list [ref=e18]:
          - listitem [ref=e19]:
            - link "لوحة التحكم" [ref=e20] [cursor=pointer]:
              - /url: /dashboard/command-center
              - img [ref=e21]
              - generic [ref=e26]: لوحة التحكم
          - listitem [ref=e27]:
            - link "الرسائل" [ref=e28] [cursor=pointer]:
              - /url: /dashboard/inbox
              - img [ref=e29]
              - generic [ref=e31]: الرسائل
          - listitem [ref=e32]:
            - link "الطلبات" [ref=e33] [cursor=pointer]:
              - /url: /dashboard/orders
              - img [ref=e34]
              - generic [ref=e37]: الطلبات
          - listitem [ref=e38]:
            - link "المنتجات والمخزون" [ref=e39] [cursor=pointer]:
              - /url: /dashboard/products
              - img [ref=e40]
              - generic [ref=e44]: المنتجات والمخزون
          - listitem [ref=e45]:
            - link "ذكاء المنتجات" [ref=e46] [cursor=pointer]:
              - /url: /dashboard/products-intelligence
              - img [ref=e47]
              - generic [ref=e55]: ذكاء المنتجات
          - listitem [ref=e56]:
            - link "التحويل البشري" [ref=e57] [cursor=pointer]:
              - /url: /dashboard/handoff
              - img [ref=e58]
              - generic [ref=e60]: التحويل البشري
          - listitem [ref=e61]:
            - link "المحادثات" [ref=e62] [cursor=pointer]:
              - /url: /dashboard/conversations
              - img [ref=e63]
              - generic [ref=e65]: المحادثات
          - listitem [ref=e66]:
            - link "الإحصائيات" [ref=e67] [cursor=pointer]:
              - /url: /dashboard/statistics
              - img [ref=e68]
              - generic [ref=e70]: الإحصائيات
          - listitem [ref=e71]:
            - link "القنوات" [ref=e72] [cursor=pointer]:
              - /url: /dashboard/settings/channels
              - img [ref=e73]
              - generic [ref=e76]: القنوات
          - listitem [ref=e77]:
            - link "AI Agent" [ref=e78] [cursor=pointer]:
              - /url: /dashboard/settings/ai-agent
              - img [ref=e79]
              - generic [ref=e82]: AI Agent
          - listitem [ref=e83]:
            - link "الشحن" [ref=e84] [cursor=pointer]:
              - /url: /dashboard/settings/shipping
              - img [ref=e85]
              - generic [ref=e90]: الشحن
          - listitem [ref=e91]:
            - link "المستخدمين والأدوار" [ref=e92] [cursor=pointer]:
              - /url: /dashboard/settings/users
              - img [ref=e93]
              - generic [ref=e98]: المستخدمين والأدوار
          - listitem [ref=e99]:
            - link "السجلات" [ref=e100] [cursor=pointer]:
              - /url: /dashboard/logs
              - img [ref=e101]
              - generic [ref=e104]: السجلات
          - listitem [ref=e105]:
            - link "الملف الشخصي" [ref=e106] [cursor=pointer]:
              - /url: /dashboard/profile
              - img [ref=e107]
              - generic [ref=e110]: الملف الشخصي
          - listitem [ref=e111]:
            - link "الإعدادات" [ref=e112] [cursor=pointer]:
              - /url: /dashboard/settings
              - img [ref=e113]
              - generic [ref=e116]: الإعدادات
          - listitem [ref=e117]:
            - link "غرفة التحكم التجريبي" [ref=e118] [cursor=pointer]:
              - /url: /dashboard/pilot-control
              - img [ref=e119]
              - generic [ref=e121]: غرفة التحكم التجريبي
          - listitem [ref=e122]:
            - link "مختبر Haidi" [ref=e123] [cursor=pointer]:
              - /url: /dashboard/haidi/lab
              - img [ref=e124]
              - generic [ref=e126]: مختبر Haidi
          - listitem [ref=e127]:
            - link "تعلم Haidi" [ref=e128] [cursor=pointer]:
              - /url: /dashboard/haidi/learning
              - img [ref=e129]
              - generic [ref=e137]: تعلم Haidi
          - listitem [ref=e138]:
            - link "إعدادات Haidi" [ref=e139] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e140]
              - generic [ref=e143]: إعدادات Haidi
          - listitem [ref=e144]:
            - link "الأمان" [ref=e145] [cursor=pointer]:
              - /url: /dashboard/security
              - img [ref=e146]
              - generic [ref=e148]: الأمان
          - listitem [ref=e149]:
            - link "الأجهزة" [ref=e150] [cursor=pointer]:
              - /url: /dashboard/devices
              - img [ref=e151]
              - generic [ref=e154]: الأجهزة
      - generic [ref=e155]:
        - generic [ref=e157]:
          - img [ref=e158]
          - paragraph [ref=e161]: متجر ذكي مدعوم بالذكاء الاصطناعي
        - button "تسجيل الخروج" [ref=e162]:
          - img [ref=e163]
          - generic [ref=e166]: تسجيل الخروج
    - main [ref=e167]:
      - generic [ref=e169]:
        - generic [ref=e171]:
          - img [ref=e173]
          - textbox "Search" [ref=e176]:
            - /placeholder: بحث في الطلبات والمحادثات...
        - generic [ref=e177]:
          - button "Open notifications" [ref=e178]:
            - img [ref=e179]
            - generic [ref=e182]: Open notifications
            - generic [ref=e183]: "1"
          - button "Open settings" [ref=e184]:
            - img [ref=e185]
            - generic [ref=e188]: Open settings
          - button "Open user menu" [ref=e189]:
            - generic [ref=e191]: YH
            - generic [ref=e192]: Open user menu
      - generic [ref=e194]:
        - generic [ref=e196]:
          - generic [ref=e197]:
            - img [ref=e198]
            - text: Pilot control room
          - generic [ref=e200]:
            - heading "غرفة الطيار للواتساب" [level=1] [ref=e201]
            - paragraph [ref=e202]: متابعة health، n8n، Evolution، آخر الرسائل، وعدّادات الحماية قبل تشغيل التجربة اليدوية الآمنة.
          - generic [ref=e203]:
            - generic [ref=e204]: Kill switch OFF
            - generic [ref=e205]: n8n active
            - generic [ref=e206]: Evolution connected
            - generic [ref=e207]: live-ready
        - generic [ref=e208]:
          - generic [ref=e209]:
            - generic [ref=e210]:
              - img [ref=e211]
              - text: Date filters
            - button "Today" [ref=e212]
            - button "This week" [ref=e213]
            - button "This month" [ref=e214]
          - generic [ref=e215]:
            - generic [ref=e216]:
              - generic [ref=e217]: From
              - textbox [ref=e218]: 2026-05-06
            - generic [ref=e219]:
              - generic [ref=e220]: To
              - textbox [ref=e221]: 2026-05-06
            - button "Apply" [ref=e222]:
              - img [ref=e223]
              - text: Apply
            - button "Reset" [ref=e225]:
              - img [ref=e226]
              - text: Reset
        - generic [ref=e229]:
          - generic [ref=e231]:
            - generic [ref=e232]:
              - paragraph [ref=e233]: الصحة العامة
              - paragraph [ref=e234]: ok · ok · ok
              - paragraph [ref=e235]: "App: https://admin.nex-lnk.online"
            - img [ref=e237]
          - generic [ref=e240]:
            - generic [ref=e241]:
              - paragraph [ref=e242]: Kill switch
              - paragraph [ref=e243]: "OFF"
              - paragraph [ref=e244]: يجب أن يبقى OFF أثناء التجربة
            - img [ref=e246]
          - generic [ref=e249]:
            - generic [ref=e250]:
              - paragraph [ref=e251]: Dead letters
              - paragraph [ref=e252]: "0"
              - paragraph [ref=e253]: رسائل فشل بحاجة مراجعة
            - img [ref=e255]
          - generic [ref=e258]:
            - generic [ref=e259]:
              - paragraph [ref=e260]: Handoffs
              - paragraph [ref=e261]: "7"
              - paragraph [ref=e262]: تحويلات بشرية مفتوحة
            - img [ref=e264]
        - generic [ref=e268]:
          - button "Export" [ref=e269]:
            - img [ref=e270]
            - text: Export
            - img [ref=e273]
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
                  - paragraph: "Generated at: 2026-05-06T13:40:14.665Z"
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
        - generic [ref=e275]:
          - generic [ref=e276]:
            - generic [ref=e277]:
              - img [ref=e278]
              - heading "Build Identity" [level=2] [ref=e281]
            - generic [ref=e282]:
              - generic [ref=e283]:
                - generic [ref=e284]: Version
                - generic [ref=e285]: 2.23.4
              - generic [ref=e286]:
                - generic [ref=e287]: Version Name
                - generic [ref=e288]: normalize-production-domain-and-fix-critical-launch-blockers
              - generic [ref=e289]:
                - generic [ref=e290]: Commit
                - generic [ref=e291]: unknown
              - generic [ref=e292]:
                - generic [ref=e293]: Built
                - generic [ref=e294]: ٦‏/٥‏/٢٠٢٦ ٧:٥٥:٢٦ ص
          - generic [ref=e295]:
            - generic [ref=e296]:
              - img [ref=e297]
              - heading "Workflow & safety" [level=2] [ref=e301]
            - generic [ref=e302]:
              - generic [ref=e303]:
                - generic [ref=e304]: n8n workflow
                - generic [ref=e305]: Active
              - generic [ref=e306]:
                - generic [ref=e307]: Evolution
                - generic [ref=e308]: Connected
              - generic [ref=e309]:
                - generic [ref=e310]: Shopify last sync
                - generic [ref=e311]: ٣‏/٥‏/٢٠٢٦ ٨:٤٩:٣٢ م
              - generic [ref=e312]:
                - generic [ref=e313]: Duplicate blocks
                - generic [ref=e314]: "0"
          - generic [ref=e315]:
            - generic [ref=e316]:
              - img [ref=e317]
              - heading "Safety blockers" [level=2] [ref=e320]
            - list [ref=e321]:
              - listitem [ref=e322]: Owner live order approval required
        - generic [ref=e323]:
          - generic [ref=e324]:
            - img [ref=e325]
            - heading "Pilot Actions" [level=2] [ref=e327]
          - generic [ref=e328]:
            - button "إيقاف Haidi" [ref=e329]:
              - img [ref=e330]
              - generic [ref=e333]: إيقاف Haidi
            - button "إيقاف الطلبات" [ref=e334]:
              - img [ref=e335]
              - generic [ref=e338]: إيقاف الطلبات
            - button "فتح Products Search QA" [ref=e339]:
              - img [ref=e340]
              - generic [ref=e343]: فتح Products Search QA
            - button "فتح Handoff Center" [ref=e344]:
              - img [ref=e345]
              - generic [ref=e347]: فتح Handoff Center
          - generic [ref=e348]:
            - link "Health API" [ref=e349] [cursor=pointer]:
              - /url: /api/health
              - img [ref=e350]
              - generic [ref=e354]: Health API
            - link "Haidi Settings" [ref=e355] [cursor=pointer]:
              - /url: /dashboard/haidi/settings
              - img [ref=e356]
              - generic [ref=e359]: Haidi Settings
              - img [ref=e360]
        - generic [ref=e362]:
          - generic [ref=e363]:
            - generic [ref=e364]:
              - img [ref=e365]
              - heading "آخر 10 inbound messages" [level=2] [ref=e367]
            - list [ref=e368]:
              - listitem [ref=e369]:
                - generic [ref=e370]:
                  - generic [ref=e371]:
                    - generic [ref=e372]: whatsapp_evolution
                    - generic [ref=e373]: ٦‏/٥‏/٢٠٢٦ ٣:٤٥:٣٧ م
                  - generic [ref=e374]: Conversation 2011···.net
                - paragraph [ref=e375]: هاي
              - listitem [ref=e376]:
                - generic [ref=e377]:
                  - generic [ref=e378]:
                    - generic [ref=e379]: whatsapp_evolution
                    - generic [ref=e380]: ٦‏/٥‏/٢٠٢٦ ٣:٤٢:٥٠ م
                  - generic [ref=e381]: Conversation 2011···.net
                - paragraph [ref=e382]: عايز اشوف البوركيني ؟
              - listitem [ref=e383]:
                - generic [ref=e384]:
                  - generic [ref=e385]:
                    - generic [ref=e386]: whatsapp_evolution
                    - generic [ref=e387]: ٦‏/٥‏/٢٠٢٦ ٧:٢٩:٣٤ ص
                  - generic [ref=e388]: Conversation 2011···.net
                - paragraph [ref=e389]: هاي
              - listitem [ref=e390]:
                - generic [ref=e391]:
                  - generic [ref=e392]:
                    - generic [ref=e393]: whatsapp_evolution
                    - generic [ref=e394]: ٦‏/٥‏/٢٠٢٦ ٧:٢٥:٤٣ ص
                  - generic [ref=e395]: Conversation 2010···.net
                - paragraph [ref=e396]: hi
              - listitem [ref=e397]:
                - generic [ref=e398]:
                  - generic [ref=e399]:
                    - generic [ref=e400]: whatsapp_evolution
                    - generic [ref=e401]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e402]: Conversation 2011···.net
                - paragraph [ref=e403]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e404]:
                - generic [ref=e405]:
                  - generic [ref=e406]:
                    - generic [ref=e407]: whatsapp_evolution
                    - generic [ref=e408]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٣ ص
                  - generic [ref=e409]: Conversation unknown
                - paragraph [ref=e410]: —
              - listitem [ref=e411]:
                - generic [ref=e412]:
                  - generic [ref=e413]:
                    - generic [ref=e414]: whatsapp_evolution
                    - generic [ref=e415]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٢ ص
                  - generic [ref=e416]: Conversation 2011···.net
                - paragraph [ref=e417]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e418]:
                - generic [ref=e419]:
                  - generic [ref=e420]:
                    - generic [ref=e421]: whatsapp_evolution
                    - generic [ref=e422]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠١ ص
                  - generic [ref=e423]: Conversation unknown
                - paragraph [ref=e424]: —
              - listitem [ref=e425]:
                - generic [ref=e426]:
                  - generic [ref=e427]:
                    - generic [ref=e428]: whatsapp_evolution
                    - generic [ref=e429]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٠ ص
                  - generic [ref=e430]: Conversation 2011···.net
                - paragraph [ref=e431]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e432]:
                - generic [ref=e433]:
                  - generic [ref=e434]:
                    - generic [ref=e435]: whatsapp_evolution
                    - generic [ref=e436]: ٦‏/٥‏/٢٠٢٦ ٦:٥٠:٥٩ ص
                  - generic [ref=e437]: Conversation unknown
                - paragraph [ref=e438]: —
          - generic [ref=e439]:
            - generic [ref=e440]:
              - img [ref=e441]
              - heading "آخر 10 outbound messages" [level=2] [ref=e444]
            - list [ref=e445]:
              - listitem [ref=e446]:
                - generic [ref=e447]:
                  - generic [ref=e448]:
                    - generic [ref=e449]: whatsapp_evolution
                    - generic [ref=e450]: ٦‏/٥‏/٢٠٢٦ ٣:٤٥:٣٨ م
                  - generic [ref=e451]: Conversation 2011···.net
                - paragraph [ref=e452]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e453]:
                - generic [ref=e454]:
                  - generic [ref=e455]:
                    - generic [ref=e456]: whatsapp_evolution
                    - generic [ref=e457]: ٦‏/٥‏/٢٠٢٦ ٣:٤٢:٥٢ م
                  - generic [ref=e458]: Conversation 2011···.net
                - paragraph [ref=e459]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e460]:
                - generic [ref=e461]:
                  - generic [ref=e462]:
                    - generic [ref=e463]: whatsapp_evolution
                    - generic [ref=e464]: ٦‏/٥‏/٢٠٢٦ ٧:٢٩:٣٦ ص
                  - generic [ref=e465]: Conversation 2011···.net
                - paragraph [ref=e466]: طلبك مع فريق Youlya، وهيتم التواصل معاكي في أقرب وقت.
              - listitem [ref=e467]:
                - generic [ref=e468]:
                  - generic [ref=e469]:
                    - generic [ref=e470]: whatsapp_evolution
                    - generic [ref=e471]: ٦‏/٥‏/٢٠٢٦ ٧:٢٥:٤٦ ص
                  - generic [ref=e472]: Conversation 2010···.net
                - paragraph [ref=e473]: ممكن توضحي أكثر؟
              - listitem [ref=e474]:
                - generic [ref=e475]:
                  - generic [ref=e476]:
                    - generic [ref=e477]: whatsapp_evolution
                    - generic [ref=e478]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٥ ص
                  - generic [ref=e479]: Conversation 2011···.net
                - paragraph [ref=e480]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e481]:
                - generic [ref=e482]:
                  - generic [ref=e483]:
                    - generic [ref=e484]: whatsapp_evolution
                    - generic [ref=e485]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e486]: Conversation unknown
                - paragraph [ref=e487]: ممكن توضحي أكثر؟
              - listitem [ref=e488]:
                - generic [ref=e489]:
                  - generic [ref=e490]:
                    - generic [ref=e491]: whatsapp_evolution
                    - generic [ref=e492]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٤ ص
                  - generic [ref=e493]: Conversation 2011···.net
                - paragraph [ref=e494]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e495]:
                - generic [ref=e496]:
                  - generic [ref=e497]:
                    - generic [ref=e498]: whatsapp_evolution
                    - generic [ref=e499]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٣ ص
                  - generic [ref=e500]: Conversation unknown
                - paragraph [ref=e501]: ممكن توضحي أكثر؟
              - listitem [ref=e502]:
                - generic [ref=e503]:
                  - generic [ref=e504]:
                    - generic [ref=e505]: whatsapp_evolution
                    - generic [ref=e506]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠٢ ص
                  - generic [ref=e507]: Conversation 2011···.net
                - paragraph [ref=e508]: "اختاري المقاس المناسب: S / M / L / XL."
              - listitem [ref=e509]:
                - generic [ref=e510]:
                  - generic [ref=e511]:
                    - generic [ref=e512]: whatsapp_evolution
                    - generic [ref=e513]: ٦‏/٥‏/٢٠٢٦ ٦:٥١:٠١ ص
                  - generic [ref=e514]: Conversation unknown
                - paragraph [ref=e515]: ممكن توضحي أكثر؟
        - generic [ref=e516]:
          - generic [ref=e517]:
            - img [ref=e518]
            - heading "Synthetic Webhook Test" [level=2] [ref=e522]
          - generic [ref=e523]:
            - paragraph [ref=e524]: "Send a safe synthetic message to verify the loop without real WhatsApp:"
            - generic [ref=e525]: "curl -X POST https://admin.nex-lnk.online/webhook/youlya-whatsapp \\ -H \"Content-Type: application/json\" \\ -d '{\"data\":{\"key\":{\"remoteJid\":\"201000000000@s.whatsapp.net\",\"fromMe\":false},\"message\":{\"conversation\":\"هاي\"},\"messageTimestamp\":$(date +%s)}}'"
            - paragraph [ref=e526]: "Expected: HTTP 200, workflow execution created, no real message sent to customer."
      - paragraph [ref=e528]: Youlya AI Commerce OS · v2.23.4 normalize-production-domain-and-fix-critical-launch-blockers · commit unknown · built 2026-05-06 04:55 · production
  - alert [ref=e529]
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