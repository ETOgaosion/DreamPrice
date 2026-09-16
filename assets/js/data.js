/*
 * DreamPrice — researched cost data
 *
 * Every figure below is either (a) sourced from a primary/official document or a
 * live listing, or (b) derived arithmetically from such figures. Derived values
 * carry `est: true`. Ranges are {low, base, high}; `low` is the optimistic case,
 * `high` the pessimistic one.
 *
 * Research date: 2026-09-15.
 */

export const META = {
  researchedOn: '2026-09-15',
  currencies: ['CNY', 'JPY', 'NOK', 'USD', 'EUR'],
};

/* Units of each currency per 1 USD. USD is the pivot for all conversion. */
export const FX = {
  asOf: '2026-09-14',
  perUsd: {
    USD: 1,
    CNY: 6.767,
    JPY: 154.5,
    NOK: 9.3213,
    EUR: 0.8657,
  },
  notes: [
    ['CNY', 'PBOC central parity 2026-09-15: 1 USD = 6.7670 (spot traded 6.7108).'],
    ['JPY', 'USD/JPY 154.55, 2026-09-15 early Asia. Fed decides 09-16, BoJ 09-18 — expect volatility.'],
    ['NOK', 'Norges Bank official middle rate 2026-09-14: 1 USD = 9.3213, 1 EUR = 10.7670.'],
  ],
};

export const CATEGORIES = {
  capital:     { label: 'Depreciation / capital loss', color: '#f472b6' },
  tax:         { label: 'Taxes & registration',        color: '#f59e0b' },
  insurance:   { label: 'Insurance',                   color: '#60a5fa' },
  energy:      { label: 'Fuel / electricity',          color: '#34d399' },
  maintenance: { label: 'Servicing & maintenance',     color: '#a78bfa' },
  tyres:       { label: 'Tyres & wheels',              color: '#fb923c' },
  parking:     { label: 'Parking',                     color: '#22d3ee' },
  tolls:       { label: 'Tolls',                       color: '#facc15' },
  rent:        { label: 'Rent',                        color: '#f87171' },
  utilities:   { label: 'Utilities & internet',        color: '#4ade80' },
  fees:        { label: 'Fees & admin',                color: '#94a3b8' },
};

/* ------------------------------------------------------------------ */
/* Source registry                                                    */
/* ------------------------------------------------------------------ */
export const SRC = {
  // China — car
  emeyaPrice:    { t: 'BitAuto — Emeya 2026 lineup launch',            u: 'https://www.bitauto.com/article/1003103797757/' },
  emeyaPcauto:   { t: 'PCauto — Emeya price & trim table',             u: 'https://price.pcauto.com.cn/sg29210/' },
  emeyaGold:     { t: '网易汽车 — Emeya 900 GOLD launch (2026-08-31)', u: 'https://www.163.com/auto/article/L5MG92O00008856R.html' },
  nevTax:        { t: '财政部/税务总局/工信部 2023年第10号公告 (NEV purchase tax)', u: 'https://www.gov.cn/zhengce/zhengceku/202306/content_6887734.htm' },
  nevTaxQa:      { t: '财政部 — worked example of the capped NEV relief', u: 'https://www.gov.cn/zhengce/202306/content_6889002.htm' },
  luxTax:        { t: '财政部/税务总局公告2025年第3号 (ultra-luxury consumption tax)', u: 'https://szs.mof.gov.cn/zhengcefabu/202507/t20250717_3968027.htm' },
  vesselTax:     { t: '财税〔2018〕74号 — BEVs outside 车船税 scope',     u: 'https://www.mof.gov.cn/gkml/caizhengwengao/wg2018/wg201807/201810/t20181023_3052991.htm' },
  cpicJqx:       { t: 'CPIC — 交强险 rate table',                       u: 'https://www.cpic.com.cn/c/2025-12-30/1879712.shtml' },
  cpicNev:       { t: 'CPIC — 50万+ NEV first-year premium exceeds ¥18,000', u: 'https://cpic.com.cn/c/2025-12-11/1878978.shtml' },
  emeyaConfig:   { t: 'Maiche — Emeya full configuration & consumption table', u: 'https://www.maiche.com/s9037/config.html' },
  emeyaOwner:    { t: 'Autohome owner test — 274 km highway run',       u: 'https://club.autohome.com.cn/bbs/thread/00390832c61d5001/108784437-1.html' },
  szElec:        { t: '深圳供电局 / 本地宝 — residential electricity tariff', u: 'http://sz.bendibao.com/news/202671/1007122.htm' },
  szCharge:      { t: 'Shenzhen public charging rate survey',           u: 'https://hk.trip.com/guide/transport/%E6%B7%B1%E5%9C%B3%E9%9B%BB%E5%8B%95%E8%BB%8A%E5%85%85%E9%9B%BB%E5%9C%B0%E5%9C%96.html' },
  lotusWarranty: { t: 'Lotus — Emeya warranty terms',                   u: 'https://www.lotuscars.com/en-SG/support/warranty/emeya' },
  lotusFreeSvc:  { t: '牛品汇 — Lotus 5-year free scheduled servicing',  u: 'https://niupinhui.com/car/carnews/6224.html' },
  psEvTyre:      { t: 'luntai.net.cn — Michelin Pilot Sport EV price comparison', u: 'https://www.luntai.net.cn/tyres/michelin-305-35-21-pilot_sport_ev/108+200+201+202+205' },
  residual:      { t: '中国汽车流通协会 × 精真估《2026年8月保值率报告》', u: 'https://npo00410y.npoall.com/news/itemid-303213.html' },
  guaziEmeya:    { t: 'Guazi — 2024 Emeya L+ at 65.9% of original MSRP', u: 'https://www.guazi.com/car-detail/c166002704207265.html' },
  szQuota:       { t: '深交规〔2024〕3号 — BEV quota has no cap or lottery', u: 'https://jtys.sz.gov.cn/gkmlpt/content/11/11168/mpost_11168012.html' },
  szInspect:     { t: '国务院 — 机动车检验制度改革 (no test in first 6 years)', u: 'https://www.gov.cn/zhengce/zhengceku/2022-10/19/content_5719521.htm' },
  szParking:     { t: '前海金融中心 — monthly parking card pricing',      u: 'https://hytzzs2.b2b168.com/s269715558.html' },

  // China — loft
  cihIndex:      { t: '中指研究院《深圳住房租赁市场监测月报》2026年05月', u: 'https://www.cih-index.com/report/detail/123553.html' },
  leju2026:      { t: '乐居财经《2026年上半年深圳租赁市场半年度研判报告》', u: 'https://www.lejucaijing.com/news-7480093787197994808.html' },
  loftNanshan:   { t: '乐有家 — 阳光科创中心 50㎡ 复式 at ¥6,800/mo',     u: 'https://shenzhen.leyoujia.com/zf/p102802m2r1_2_3lc1_2jg68f70_72_74_75zx48t2_4re1s7/' },
  loftFutian:    { t: '58同城 — 紫元元大厦 56.69㎡ loft, 物业费 9元/㎡/月', u: 'https://sz.58.com/zufang/88017250235482x.shtml' },
  loftBaoan:     { t: '58同城 — Bao\'an / Longhua loft listings',        u: 'https://mob.58.com/zf/sz/ssc-65/szlhxq/' },
  szAgency:      { t: '深圳热线 — 链家/贝壳 rental agency fee structure',  u: 'http://news.szonline.cn/xf/2026/0826/756482.html' },
  szRentalLaw:   { t: '《住房租赁条例》(in force 2025-09-15)',           u: 'https://www.sz.gov.cn/ztfw/zfly/wyk_184880/content/post_12341639.html' },
  szElecConvert: { t: '深圳市发改委 — 商务公寓 may apply for residential tariff', u: 'http://news.szhome.com/375838.html' },
  szElecEnforce: { t: '龙华 enforcement — landlord fined for ¥0.98/kWh',  u: 'https://m.mp.oeeee.com/oe/BAAFRD0000202512081490332.html' },
  szWater:       { t: '深圳市水务局 — official water & sewage price table', u: 'https://swj.sz.gov.cn/zwfw/bmxx/gs/ggssfsj/' },
  szPropMgmt:    { t: '《深圳市物业管理服务收费管理规定》— 公寓 is 非住宅', u: 'http://www.sz.gov.cn/szzt2010/zdlyzl/sfxx/bz/fw/content/post_1319769.html' },
  szBroadband:   { t: '深圳移动 broadband rate card (2026-09-05)',        u: 'https://www.taocanjie.com/2026-nian-9-yue-5-ri-guang-dong-sheng-shen-zhen-shi-yi-dong-kuan-dai-xin-zhuang-duo-shao-qian-yi.html' },

  // Japan — car
  gtrMsrp:       { t: 'Nissan — final R35 grade pricing (2024-03-14)',   u: 'https://global.nissannews.com/ja-JP/releases/240314-01-j' },
  gtrGoonet:     { t: 'goo-net — R35 used market, 200 listings',          u: 'https://www.goo-net.com/usedcar/brand-NISSAN/car-GT-R/' },
  gtrUcarfan:    { t: 'ucarfan — R35 used prices by model year',          u: 'https://ucarfan.com/nissan/gt-r/' },
  gtrGoonetMag:  { t: 'goo-net magazine — real 支払総額 examples',         u: 'https://www.goo-net.com/magazine/newmodel/car-news/266043/' },
  jpKankyo:      { t: '東京都主税局 — 環境性能割 abolished 2026-03-31',     u: 'https://www.tax.metro.tokyo.lg.jp/kazei/automobiles/kankyou' },
  jpMof2026:     { t: '財務省 — FY2026 tax reform outline',               u: 'https://www.mof.go.jp/tax_policy/tax_reform/outline/fy2026/08taikou_gaiyou.htm' },
  jpWeightTax:   { t: 'Spec Tank — R35 自動車重量税 by age band',          u: 'https://spectank.jp/tax/002114848.html' },
  jpJibaiseki:   { t: 'CALDRIVE — 自賠責保険 rates incl. 2026-11 revision', u: 'https://caldrive.jp/tax/' },
  jpRoadTax:     { t: '長野県 — 自動車税 rate table by displacement',      u: 'https://www.pref.nagano.lg.jp/zeimu/kurashi/kenze/aramashi/aramashi/jidoshaze/index.html' },
  jpHeavyTax13:  { t: '群馬県 — 13-year 重課 rates',                       u: 'https://www.pref.gunma.jp/site/tax/5380.html' },
  nissanTokyo:   { t: '日産東京 — service price list, R35限定 column (2026-04-01)', u: 'https://ni-tokyo.nissan-dealer.jp/content/dam/nissan/3300_%E6%97%A5%E7%94%A3%E6%9D%B1%E4%BA%AC%E8%B2%A9%E5%A3%B2%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE/pdf/nts_2604tenken_price.pdf' },
  gtrShaken:     { t: 'NO GT-R, NO LIFE — itemised ¥161,843 dealer 車検',  u: 'https://www.no-gtr-no-life.com/entry/R35-car-inspection' },
  gtrShakenSpec: { t: 'Tokyo AutoLab — GT-R specialist 車検 ~¥140,000',   u: 'https://tokyo-autolab.com/?p=2689' },
  girojClass:    { t: 'GIROJ 型式別料率クラス — R35 (車両10/対人1/対物1/傷害3)', u: 'https://www.giroj.or.jp/ratemaking/automobile/vehicle_model/' },
  gtrInsCls:     { t: 'insweb — sports car rate classes citing GIROJ',    u: 'https://www.insweb.co.jp/car/hokenryou/sportscar.html' },
  gtrInsOwner:   { t: 'GT-R維持費用の部屋 — actual premiums 2023-2025',     u: 'http://sitamati.a.la9.jp/GTR06.html' },
  gtrInsModel:   { t: 'CARPRIME — modelled ¥140,000 premium at ¥8.6M cover', u: 'https://car-me.jp/articles/5728' },
  jpFuel:        { t: '福井新聞 citing METI/ANRE — ハイオク ¥180.90/L (2026-09-07)', u: 'https://www.fukuishimbun.co.jp/articles/-/2694499' },
  jpEnenpi:      { t: 'e燃費 — R35 real-world 7.09 km/L',                 u: 'https://e-nenpi.com/enenpi/carname/967' },
  jpMinkara:     { t: 'みんカラ — R35 fuel log, 5,374 records, 7.25 km/L', u: 'https://minkara.carview.co.jp/car/nissan/nissan_gt_r/nenpi/' },
  gtnetTyre:     { t: 'GTNET — Dunlop SP SPORT MAXX GT600 fitted ¥299,200/set', u: 'https://www.gtnet.co.jp/maintenance/gt-r/tire/index.php' },
  gtrTyreAlt:    { t: 'NO GT-R, NO LIFE — non-run-flat Michelin PS4S ¥195,400', u: 'https://www.no-gtr-no-life.com/entry/R35GTR-tire-michelin' },
  gtnetBrake:    { t: 'GTNET — genuine rotor & labour pricing',           u: 'https://www.gtnet.co.jp/maintenance/gt-r/brake_rotor/index.php' },
  nissanNhpc:    { t: 'Nissan NHPC — inspections & designated fluids are a warranty condition', u: 'https://www.nissan.co.jp/SERVICE/NISSAN-SERVICE/NHPC/' },
  jpParkMinato:  { t: '月極駐車場どっとこむ — 港区 average ¥47,435 (630 listings)', u: 'https://www.monthly-p.com/zone/%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%AF%E5%8C%BA/' },
  jpParkShibuya: { t: 'カーパーキング — 渋谷区 ¥47,914 / 新宿区 ¥41,462',   u: 'https://carparking.jp/area/city/13113/' },
  gtrAppreciate: { t: 'BestCar — R35 used average ~¥17M and still climbing', u: 'https://bestcarweb.jp/feature/column/1503970' },
  gtrAuction:    { t: 'Sellca — realised dealer-auction results for R35',  u: 'https://www.sellca-sellcar.com/trade_result/nissan/gt-r/' },

  // Japan — tower mansion
  rehouseTower:  { t: '三井のリハウス — contracted tower-mansion rents by ward', u: 'https://www.rehouse.co.jp/special/wangan/article/0008/' },
  suumoToyosu:   { t: 'SUUMO — 豊洲 rent index (updated 2026-04-13)',      u: 'https://suumo.jp/chintai/soba/tokyo/ek_26540/' },
  suumoMinato:   { t: 'SUUMO — 港区 tower listings',                       u: 'https://suumo.jp/chintai/tokyo/sc_minato/nj_119/' },
  eheyaTsukishima:{t: 'いい部屋ネット — グランドシティタワー月島, real contract terms', u: 'https://www.eheya.net/detail/300001793002437000001/' },
  sumaiSurfin:   { t: '住まいサーフィン — tower mansion 管理費 ¥10k-30k/mo', u: 'https://www.sumai-surfin.com/columns/mansion-knowledge/tawaman-monthlyexpenses' },
  suumoInitial:  { t: 'SUUMO — 初期費用 is 4.5-5× monthly rent',            u: 'https://suumo.jp/article/oyakudachi/oyaku/chintai/fr_money/chintai_shokihiyou/' },
  jpRenewal:     { t: 'MLIT via chintai-assist — 更新料 = 1 month every 2 years', u: 'https://www.chintai-assist.jp/blog/entry-680724/' },
  jpKakei:       { t: '総務省 家計調査 2025 — household utility averages',   u: 'https://pps-net.org/energyprice_cat/together' },
  tepco:         { t: 'TEPCO EP — スタンダードS tariff (Kanto)',            u: 'https://www.tepco.co.jp/ep/private/plan/standard/kanto/index-j.html' },
  nhkFee:        { t: 'NHK 受信料の窓口 — official fee schedule',            u: 'https://www.nhk-cs.jp/jushinryo/syokai.html' },
  docomoHikari:  { t: 'NTT Docomo — 光 1G マンション ¥4,400/mo',            u: 'https://www.onlineshop.docomobusiness.ntt.com/s/82e744da-c55d-11ee-8ffe-288316e33354' },
  gtnGuarantor:  { t: 'GTN — foreigner guarantor terms & emergency contacts', u: 'https://www.gtn.co.jp/business/realestate/rent-guarantor/agency' },

  // Norway — car
  mbE53:         { t: 'mercedes-benz.no — AMG E 53 Estate NOK 1,487,900',  u: 'https://www.mercedes-benz.no/models/e-class-estate-s214-806-2/' },
  mbE53Press:   { t: 'Mercedes-Benz Norge — E 53 launch press release',    u: 'https://kommunikasjon.ntb.no/pressemelding/18497065/mercedes-amg-e-53-hybrid-4matic-stasjonsvogn-er-na-tilgjengelig-for-bestilling?lang=no&publisherId=17847240' },
  broomC63:      { t: 'TV2 Broom — only three C 63 S E Performance in Norway', u: 'https://www.tv2.no/broom/kun-tre-til-salgs-i-norge-denne-er-spinnvill/18380538/' },
  lovdataEng:    { t: 'Lovdata STV 2025-12-18-2755 — engangsavgift rates 2026', u: 'https://lovdata.no/dokument/STV/forskrift/2025-12-18-2755' },
  skattRundskriv:{ t: 'Skatteetaten årsrundskriv engangsavgift 2026 (NOx removed)', u: 'https://www.skatteetaten.no/globalassets/rettskilder/avgiftsrundskriv/engangsavgift-2026.pdf' },
  ofvKalk:       { t: 'OFV — avgiftskalkulator & 2026 rate changes',       u: 'https://ofv.no/avgiftskalkulator' },
  lovdataOmreg:  { t: 'Lovdata STV 2025-12-18-2758 — omregistreringsavgift', u: 'https://lovdata.no/dokument/STV/forskrift/2025-12-18-2758' },
  skattTfa:      { t: 'Skatteetaten — trafikkforsikringsavgift 6.52 kr/day', u: 'https://www.skatteetaten.no/satser/trafikkforsikringsavgift/' },
  noInsurance:   { t: 'bilforsikringer.nu — AMG premium ranges',           u: 'https://bilforsikringer.nu/mercedes/amg/' },
  gjensidige:    { t: 'Gjensidige — bilforsikring bonus system',           u: 'https://www.gjensidige.no/forsikring/bilforsikring' },
  noFuelTax:     { t: 'Skatteetaten — veibruksavgift restored 1 Sep 2026',  u: 'https://www.skatteetaten.no/bedrift-og-organisasjon/avgifter/saravgifter/om/veibruksavgift/' },
  dinsideFuel:   { t: 'DinSide — Tromsø petrol jumped to ~27.50 kr/l on 1 Sep 2026', u: 'https://dinside.dagbladet.no/motor/steiler-litt-sykt-a-se/85092110' },
  drivstoff:     { t: 'DrivstoffAppen — national average pump prices',      u: 'https://drivstoffappen.no/' },
  bpsNord:       { t: 'BPS Nord — Tromsø toll tariffs from 1 Sep 2026',    u: 'https://bpsnord.no/2026/endrede-takster-i-bypakke-tenk-tromso-fra-1-september-2026/' },
  tenkTromso:    { t: 'Tenk Tromsø — 80-passage monthly cap, hourly rule', u: 'https://www.tenktromso.no/om-bompenger' },
  bosService:    { t: 'Bertel O. Steen — Mercedes service price list',     u: 'https://www.bos.no/bilverksted/mercedes-benz-service-5' },
  prisradar:     { t: 'Prisradar — Pirelli P Zero Winter 2 / Nokian R5 in AMG sizes', u: 'https://prisradar.no/produkter/pirelli-p-zero-winter-2-245-40r20-99w-xl' },
  vinterdekk:    { t: 'Forskrift om bruk av kjøretøy § 1-4 — 3 mm tread, 16 Oct-30 Apr in Troms', u: 'https://lovdata.no/forskrift/1990-01-25-92/kap1' },
  euKontroll:    { t: 'Statens vegvesen — EU-kontroll intervals',          u: 'https://www.vegvesen.no/kjoretoy/eie-og-vedlikeholde/eu-kontroll/nar-kan-du-ta-eu-kontroll/' },
  euKontrollPris:{ t: 'verkstedtjenester.no — EU-kontroll typical price',  u: 'https://www.verkstedtjenester.no/blogg/nar-ma-bilen-pa-eu-kontroll' },
  smartepenger:  { t: 'Smartepenger — Norwegian car depreciation curves',  u: 'https://www.smartepenger.no/bilokonomi/2230-bilkostnader-verdifall' },
  blocketC63:    { t: 'Blocket Bilguiden — C 63 S E Performance road test consumption', u: 'https://www.blocket.se/bilguiden/biltester-och-provkorningar/test-mercedes-amg-c-63-s-e-performance-aer-svar-att-tycka-om' },
  bil24E53:      { t: 'bil24.no — E 53 test: 2.1 l/100km plugged in, 6.7 on motorway', u: 'https://bil24.no/mercedes-amg-e-53-hybrid-4matic-tar-deg-og-familien-smilende-til-hytta' },

  // Norway — house
  ssbLmu:        { t: 'SSB table 09895 — Leiemarkedsundersøkelsen 2025',   u: 'https://www.ssb.no/statbank/table/09895/' },
  finnTromsdalen:{ t: 'FINN 464668125 — Tromsdalen 110 m² house, 22,000 kr/mo', u: 'https://www.finn.no/realestate/lettings/ad.html?finnkode=464668125' },
  finnHamna:     { t: 'FINN 465124508 — Hamna detached house, 22,500 kr/mo', u: 'https://www.finn.no/realestate/lettings/ad.html?finnkode=465124508' },
  finnKraemer:   { t: 'FINN 460992494 — Kræmervegen 235 m² villa, 35,000 kr/mo', u: 'https://www.finn.no/realestate/lettings/ad.html?finnkode=460992494' },
  finnSvolvaer:  { t: 'FINN 355506357 — Svolvær furnished 2-bed, 21,000 kr/mo', u: 'https://www.finn.no/realestate/lettings/ad.html?finnkode=355506357' },
  hybelLeknes:   { t: 'hybel.no — Leknes 175 m² house, 15,000 kr/mo',      u: 'https://hybel.no/bolig/356290/hus-5-roms-uttakleivveien-200-leknes/' },
  rentolaBostad: { t: 'rentola.no — Bøstad "langtidsleie" that is 1 Oct-31 May only', u: 'https://rentola.no/listings/romslig-leilighet-til-leie-lofoten-bostad-pd8ce91' },
  nrkAirbnb:     { t: 'NRK — Lofoten employers buying houses; Airbnb up 160% in the north', u: 'https://www.nrk.no/nordland/boligmangel-i-lofoten-_-reiselivet-ma-kjope-boliger-for-a-huse-sesongarbeidere-1.16462224' },
  husleieloven:  { t: 'Husleieloven §§ 3-1, 3-5, 3-7 — deposit & permitted add-ons', u: 'https://lovdata.no/dokument/NL/lov/1999-03-26-17' },
  elspot:        { t: 'Elspot — NO4 spot average 38.95 øre/kWh, 2026 YTD',  u: 'https://elspot.nu/no/strompriser-2026-historiske-spotpriser-pa-strom/' },
  norgespris:    { t: 'regjeringen.no — Norgespris 40 øre/kWh in NO4, expires 2026-12-31', u: 'https://www.regjeringen.no/no/tema/energi/strom/sporsmal-og-svar-om-norgespris/id3089310/' },
  nveStotte:     { t: 'NVE — strømstøtte: 90% of spot above 77 øre/kWh',    u: 'https://www.nve.no/reguleringsmyndigheten/kunde/stroem/dette-er-stroemstoetteordningen/' },
  elavgift:      { t: 'Skatteetaten — elavgift 7.13 øre/kWh (Tromsø pays it)', u: 'https://www.skatteetaten.no/satser/elektrisk-kraft/' },
  arva:          { t: 'kraftsystemet.no — Arva nettleie tariff',            u: 'https://kraftsystemet.no/fri-nettleie/tariffer/arva.html' },
  arvaFreeze:    { t: 'Arva — 2026 nettleie frozen, warns of a 2027 rise',  u: 'https://kommunikasjon.ntb.no/pressemelding/18744695/arva-fryser-nettleia-men-elavgiften-reduseres?lang=no&publisherId=17848600' },
  ssbHouseKwh:   { t: 'SSB table 10582 — detached house 19,676 kWh/yr',     u: 'https://www.ssb.no/en/statbank/table/10582' },
  ssbTroms:      { t: 'SSB table 08313 — Troms uses ~35% more electricity per capita', u: 'https://www.ssb.no/statbank/table/08313' },
  tromsoTax:     { t: 'Tromsø kommune — eiendomsskatt 4 promille, bunnfradrag cut to 10 kr', u: 'https://www.tromso.kommune.no/tema/bygg-vei-og-eiendom/eiendomsskatt-og-avgifter/eiendomsskatt' },
  svipper:       { t: 'Svipper — Tromsø 30-day pass 562 kr (adult)',        u: 'https://svipper.no/nyheter/30-dagersbilletter-blir-billigere.6672.aspx' },
  udiSkilled:    { t: 'UDI — skilled worker residence permit',             u: 'https://www.udi.no/skal-soke/arbeidsinnvandring/faglart/' },

  // Japan — used R35 market
  gooNetCheap:   { t: 'goo-net — R35 listings sorted by 支払総額, 193 cars', u: 'https://www.goo-net.com/usedcar/brand-NISSAN/car-GT-R/sort-lowprice/' },
  carsensorSouba:{ t: 'carsensor — R35 相場, 210 listings, count by year',   u: 'https://www.carsensor.net/usedcar/souba/NI_S154/' },
  gtrCring:      { t: 'Motor Fan — GR6 C-ring & clutch-seal failures happen on stock street cars', u: 'https://motor-fan.jp/article/132280/' },
  gtr565:        { t: '565 — GR6 C-ring, counter-gear and shift-solenoid failure modes', u: 'https://www.565.co.jp/services/r35gt-r_gr6' },
  gtrEndless:    { t: 'ENDLESS アッパープログラム — ¥500,000 税抜 GR6 countermeasure', u: 'http://www.endless-r.co.jp/post-971/' },
  gtrDuke:       { t: 'DUKE FUKUI — GR6 対策メニュー ¥400,000 税別; failure escalation pricing', u: 'https://duke-f.com/r-35/r35-mt/' },
  gtrTopSecret:  { t: 'TOP SECRET — Nissan HPC gearbox repair ¥1M+, ASSY ¥2.7M+', u: 'https://topsecret-jpn.com/services/r35-gtr-maintenance/gr6-transmission-maintenance/' },
  gtrParts:      { t: 'KUHL — 前期モデルは既に生産廃止の純正部品が数多くあり', u: 'https://kuhl-japan.com/karsblog/83452/' },
  nismoHeritage: { t: 'NISMO Heritage Parts — covers R32–R34 only, not the R35', u: 'https://www.nismo.co.jp/heritage_parts/' },
  gtrIns723:     { t: '723go — real 2026 quotes on a 2008 R35: ¥38,210–44,700, agreed value only ¥4.35–4.9M', u: 'https://723go.com/gt-r_r35_hoken_/' },
  gtrHullWall:   { t: '三井ダイレクト — no 車両保険 once 20 years from 初度登録', u: 'https://www.mitsui-direct.co.jp/car/compensation/sphere/firsttime/' },
  gtrHull15yr:   { t: 'SBI損保 — insurers start refusing 車両保険 past 15 years', u: 'https://www.sbisonpo.co.jp/car/column/column134.html' },
  gtrOmoren:     { t: 'おもれん — itemised ¥311,000/yr maintenance for an early R35', u: 'https://www.omoren.com/media/nissan/maintenance-costsofr35-240213/' },
  gtnetShaken:   { t: 'GTNET — R35 車検 base ¥80,850 + 13yr weight-tax uplift + diagnostics', u: 'https://www.gtnet.co.jp/syaken/estimate.php?maker_code=00200&model_code=05601' },
  jpShakenReal:  { t: 'あんしん車検ガイド — real R35 車検 invoices ¥154,000–462,074', u: 'https://shaken.mantan.co.jp/cost/cardetail/552' },
  jpJuukaTrigger:{ t: '宮城県 — 13-year 重課 catches cars registered on/before 2013-03-31', u: 'https://www.pref.miyagi.jp/soshiki/zeimu/car-green.html' },
  jpKankyoGone:  { t: 'JUCDA — 環境性能割 abolished 2026-03-31, new AND used', u: 'https://www.jucda.or.jp/tax/kankyouseinouwari/haishi/' },
  gtrTradeIn:    { t: 'takakuureru 2026 — R35 買取 by year: 2010 ¥6.4M, 2011 ¥6.9M, 2012 ¥6.9M', u: 'https://www.takakuureru.com/magazine/44620' },
  gtrIkkatsu:    { t: 'ikkatsu-satei — R35 買取 averages by model year (2-yr rolling)', u: 'https://ikkatsu-satei.com/gt_r.html' },
  gtrExport:     { t: 'グーネット自動車流通 — 2025 used exports 1,708,604 units, 3rd record year', u: 'https://www.goonews.jp/news_detail.php?id=13984&view=auto' },
  gtrCarsensorGrade:{ t: 'carsensor — Premium edition depreciates FASTEST of the early grades', u: 'https://wwwtst.carsensor.net/contents/market/category_1491/_68527.html' },

  // Norway — used AMG market
  skattUsedCar:  { t: 'Skatteetaten — on a used Norwegian-registered car, engangsavgift and MVA are already paid', u: 'https://www.skatteetaten.no/person/avgifter/bil/kjope-bil-i-norge/' },
  finnC63:       { t: 'FINN — Mercedes C 63 listings (61 cars)',            u: 'https://www.finn.no/mobility/discover/cars/mercedes-benz/c-klasse/c63' },
  finnC63Estate: { t: 'FINN 472806537 — 2016 C 63 estate, 88,500 km, 699,000 kr, 7 service stamps, 18" winter wheels', u: 'https://www.finn.no/mobility/item/472806537' },
  finnE53:       { t: 'FINN — Mercedes E 53 listings: only 5 in all of Norway', u: 'https://www.finn.no/mobility/discover/cars/mercedes-benz/e-klasse/e53' },
  finnE53Coupe:  { t: 'FINN 472402005 — 2019 E 53 coupé, 83,500 km, 698,900 kr, understellsbehandlet + resealed annually', u: 'https://www.finn.no/mobility/item/472402005' },
  finnE53Bos:    { t: 'FINN 471853354 — 2019 E 53 estate at Bertel O. Steen, ad itemises omregistrering 4,532 kr', u: 'https://www.finn.no/mobility/item/471853354' },
  finnC43:       { t: 'FINN — Mercedes C 43 listings (16 cars), incl. 2018 at 25,000 km for 619,000 kr', u: 'https://www.finn.no/mobility/discover/cars/mercedes-benz/c-klasse/c43' },
  finnE63:       { t: 'FINN — Mercedes E 63 listings (34 cars), incl. 2015 W212 4MATIC with 24-month warranty', u: 'https://www.finn.no/mobility/discover/cars/mercedes-benz/e-klasse/e63' },
  m156Bolts:     { t: 'FCP Euro — M156 head bolts fail below engine serial 60-060658', u: 'https://www.fcpeuro.com/blog/mercedes-benz-amg-m156-engine-common-issues' },
  m156Check:     { t: 'carchecker.pro — W204 C 63: head bolts €3,000–5,000 preventive, €6,000–8,000+ if damaged; cams €1,500–5,000', u: 'https://www.carchecker.pro/reports/mercedes_c63_amg_w204.html' },
  m177Check:     { t: 'carchecker.pro — W205 C 63: oil separator + rear main seal €2,000–4,500, transmission out', u: 'https://www.carchecker.pro/reports/mercedes_c63_w205.html' },
  e53_48v:       { t: 'Euro Premium Parts — M256 48V ISG needs attention at 130,000–190,000 km; connector corrosion reported', u: 'https://europremiumparts.com/de/blogs/buying-guides/mercedes-benz-m256-engine-guide-reliability-common-problems-tuning-potential' },
  e53Tsb:        { t: 'Mercedes TSB LI15.30-P-078376 — 48V no-restart fault is a software fix (P0A44B2 / P0AFB00)', u: 'https://dot.report/bulletins/11008058' },
  noMachineCover:{ t: 'bytt.no — machine-damage cover ends at 10–12 years / 200,000 km; average premium 10,300 kr, +16.6% YoY', u: 'https://www.bytt.no/forsikring/bilforsikring/a-ppm/bilforsikring-sa-mye-koster-en-bilforsikring-i-2026' },
  autokosten:    { t: 'autokostencheck.de — real-world consumption: M156 17.0 l/100km (184 users), E 53 12.5 (96 users)', u: 'https://www.autokostencheck.de/Mercedes/Mercedes-C-Klasse/C-63/c-63-204-amg_15202/verbrauch/' },
  noWinterTread: { t: 'Lovdata FOR-2024-09-12-2147 — 3 mm minimum tread in Troms, 16 Oct to 30 Apr', u: 'https://lovdata.no/forskrift/2024-09-12-2147' },
  prisradarWinter:{ t: 'Prisradar — winter tyre prices in W204/W205 AMG sizes', u: 'https://prisradar.no/produkter/michelin-x-ice-snow-235-40r18-95h-xl-nordiske-vinterdekk' },
  svEuFail:      { t: 'Statens vegvesen — 47% of light vehicles failed EU-kontroll in 2025', u: 'https://www.vegvesen.no/om-oss/presse/aktuelt/2026/01/elbiler-har-mange-flere-feil-pa-eu-kontroller/' },
  defaHeater:    { t: 'Nordvik — DEFA WarmUp II SmartStart package 7,450–7,829 kr, element and fitting extra', u: 'https://shop.nordvik.no/defa/471278/defa-warmup-ii-1900-smartstart' },
  nafColdStart:  { t: 'NAF — a cold engine uses ~30% more fuel over the first kilometres', u: 'https://kommunikasjon.ntb.no/pressemelding/17857220/bruk-motorvarmer-og-spar-miljoet?publisherId=2126680' },
  rustBodo:      { t: 'Bodø Antirustsenter — Norwegian roads destroy cars built for milder climates', u: 'https://bodoantirust.no/understellsbehandling/' },
  dinitrolSalt:  { t: 'Dinitrol — salt damage under the car is wear, and no warranty covers it', u: 'https://dinitrol.no/miljo/' },
  tromsoParking: { t: 'Tromsø parkering — Fjellet årskort 26,000 kr/yr (sold out, waiting list); Seminaret 1,796 kr/mo', u: 'https://tromso-parkering.no/om-tromso-parkering/priser/' },
  elbil4wd:      { t: 'Norsk elbilforening — tested: 2WD cannot climb difficult hills from a standstill; "kjøp firehjulstrekker"', u: 'https://elbil.no/ma-du-ha-firehjulstrekk-for-a-komme-deg-opp-bakken/' },
  nafGlatt:      { t: 'NAF — tyres matter more than drivetrain for stopping; 4WD does not help you back down', u: 'https://www.naf.no/trafikksikkerhet/trygg-i-trafikken/slik-kjorer-du-pa-glatt-fore' },
  carbuzzW204:   { t: 'CarBuzz — W204 C 63 values up ~15% in 18 months, but only with documented repairs', u: 'https://carbuzz.com/final-naturally-aspirated-v8-amg-pricing/' },
  pistonheadsW204:{ t: 'PistonHeads — W204 C 63 decline has "slowed dramatically"', u: 'https://www.pistonheads.com/news/ph-spottedykywt/mercedes-c63-amg-w204--the-brave-pill/44315' },
  forbrukerDealer:{ t: 'Forbrukerrådet — 5 years reklamasjonsrett from a dealer vs 2 from a private seller', u: 'https://www.forbrukerradet.no/forside/bil/kjop-og-salg-av-bil/misfornoyd-med-kjop/' },
  mbAmgOnRequest:{ t: 'mercedes-benz.no — every model group has a published service price except AMG', u: 'https://www.mercedes-benz.no/our-brands/service-5-pluss/' },

  // China — Ferrari Amalfi
  amalfiFerrari: { t: 'Ferrari — Amalfi technical specification (3,855 cc, 640 cv)', u: 'https://www.ferrari.com/en-EN/auto/ferrari-amalfi' },
  amalfiPrice:   { t: '易车 — Amalfi China launch 2025-10-16, 指导价 259.85万',        u: 'https://news.yiche.com/xinchexiaoxi/20251016/10104411558.html' },
  amalfiAutohome:{ t: '汽车之家 — Ferrari China price list',                          u: 'https://car.autohome.com.cn/price/brand-42-78.html' },
  luxTaxGov:     { t: '国务院 — 财政部/税务总局公告2025年第3号, 超豪华小汽车消费税全文', u: 'https://www.gov.cn/zhengce/zhengceku/202507/content_7033979.htm' },
  luxTax2016:    { t: '深圳税务 — 财税〔2016〕129号, 零售环节加征10%',                  u: 'https://shenzhen.chinatax.gov.cn/sztax/zcwj/zcfgk/zjzcfgk/xfszj/201611/2c245769cc704a2d8bf14dc75555f9d7.shtml' },
  luxTaxSplit:   { t: '江苏省税务局 — splitting the invoice to dodge the tax triggers back-tax and audit', u: 'https://jiangsu.chinatax.gov.cn/art/2026/1/2/art_9046_1689873.html' },
  cnImportTax:   { t: '第一财经 — China car import tariff is 15%',                     u: 'https://www.yicai.com/news/102302580.html' },
  szPlateRules:  { t: '《深圳市小汽车增量调控管理实施细则》第十五条 — 普通指标 eligibility', u: 'https://xqctk.jtys.sz.gov.cn/glbf/' },
  szPlateAuction:{ t: '深圳本地宝 — 2026年第8期车牌竞价结果, 个人均价 11,670',           u: 'https://sz.bendibao.com/jt/2026825/1011196.htm' },
  szOutOfTown:   { t: '深圳交警 — 非粤B车牌工作日高峰限行通告',                          u: 'https://szjj.sz.gov.cn/ZWGK/TZGG/GGJG/content/post_12399647.html' },
  shPlateRules:  { t: '《上海市非营业性客车额度拍卖管理规定》第七条 — 参拍资格',           u: 'https://www.shanghai.gov.cn/202502zfwj/20250220/2bbe56dd85584b51ab7e0982238baafe.html' },
  shPlateFaq:    { t: '上海市交通委 — 名下有外牌车辆可直接参拍，无需注销',                 u: 'https://jtw.sh.gov.cn/zcgd/20241231/5937514701f54d0091a349f29030ac77.html' },
  shPlateResult: { t: '上海市交通委 — 2026年第8次拍卖: 均价 ¥93,868, 中标率 14.4%',      u: 'https://jtw.sh.gov.cn/xydt/20260831/b4315f6409ac4d749ffeb4fe44547965.html' },
  gdVesselTax:   { t: '广东省财政厅 — 粤府〔2022〕81号 车船税税额表',                    u: 'http://czt.gd.gov.cn/gkmlpt/content/4/4028/post_4028842.html' },
  ferrari7yr:    { t: 'Ferrari 中国 — 7年原厂保养计划 (Genuine Maintenance)',           u: 'https://www.ferrari.com/zh-CN/auto/car-part-services-warranty-maintenance' },
  ferrariSzDealer:{ t: '骏佳行 — the only Ferrari dealer in Shenzhen, service in 坂田',  u: 'https://shenzhen.ferraridealers.com/zh-CN/about-us' },
  ferrariSvcCost:{ t: '凤凰网 — ultra-luxury brand servicing cost comparison',          u: 'https://auto.ifeng.com/c/8av7KKNXvty' },
  romaInsurance: { t: '车市锐尔 — Ferrari Roma insurance breakdown, 车损险 ≈ ¥54,000',   u: 'https://www.csruier.cn/cs/12894.html' },
  cpicSupercar:  { t: '中国太保 — insurers decline 车损险 on Ferraris, liability only',  u: 'https://www.cpic.com.cn/c/2021-05-31/1764163.shtml' },
  cnPartsRatio:  { t: '中国消费网 — 中保研 零整比100指数 390.77% (第21期)',              u: 'https://www.ccn.com.cn/Content/2026/01-04/1821575330.html' },
  sz98Petrol:    { t: '金投网 — 广东98号汽油 ¥11.00/L (2026-09-12)',                    u: 'https://energy.cngold.org/c/2026-09-15/c10757945.html' },
  amalfiFuelTest:{ t: 'drive.reviews — Amalfi real-world 14–18 L/100km',               u: 'https://www.drive.reviews/ferrari-amalfi-review-2026/' },
  amalfiTyres:   { t: 'Ferrari — Amalfi wheels: 245/35 R20 front, 285/35 R20 rear',    u: 'https://jakarta.ferraridealers.com/en-GB/articles/Introducing-the-Ferrari-Amalfi' },
  ferrariBrakes: { t: 'Europarts360 — Ferrari CCM brake replacement cost',             u: 'https://europarts360.com/blogs/guide/oem-vs-aftermarket-which-brake-pads-are-right-for-your-ferrari-f8-tributo' },
  ferrariParts:  { t: '帮手汽配 — Ferrari clutch, CCM disc and pad pricing in China',    u: 'https://www.bsqipei.com/products/1708200303655.html' },
  szParkingGov:  { t: '深圳市政府 — 停车场收费政府指导价',                               u: 'https://www.sz.gov.cn/cn/xxgk/zfxxgj/tzgg/content/post_1627515.html' },
  szParkingMkt:  { t: '大广网 — Shenzhen fixed-bay market rates by district',            u: 'https://bbs.t0001.com/bzawd/202512/908894.html' },
  romaUsed:      { t: '汽车之家二手车 — 2020 Roma, 4,000 km, Shenzhen, ask ¥2,188,000',  u: 'https://www.autohome.com.cn/x/usedcar-2009691458348646400.html' },
};

/* Helper for building a line item. */
const it = (category, label, amount, opts = {}) => ({ category, label, amount, ...opts });

const cny = (n) => `¥${Math.round(n).toLocaleString('en-US')}`;
const jpy = (n) => `¥${Math.round(n).toLocaleString('en-US')}`;
const nok = (n) => `${Math.round(n).toLocaleString('en-US')} kr`;

/*
 * 车辆购置税 for a NEV bought in 2026–2027.
 *
 * The taxable base is everything you actually paid the seller, excluding VAT
 * (《车辆购置税法》第六条) — so factory options invoiced with the car are taxed
 * too. The 2026–2027 NEV rule halves the 10% rate but caps the relief at
 * ¥15,000 per passenger car, so above roughly ¥339,000 ex-VAT the cap binds and
 * every extra yuan of options is taxed at the full 10%.
 */
export function nevPurchaseTax(invoiceInclVat) {
  const base = invoiceInclVat / 1.13;
  const gross = base * 0.10;
  const relief = Math.min(gross / 2, 15000);
  return { base, gross, relief, payable: gross - relief, capBinds: gross / 2 > 15000 };
}

/* 超豪华小汽车消费税 threshold: ¥900,000 EX-VAT (≈¥1,017,000 on the invoice). */
export const LUXURY_TAX_THRESHOLD_EX_VAT = 900000;

/* ------------------------------------------------------------------ */
/* 1. Lotus Emeya — China                                             */
/* ------------------------------------------------------------------ */
const emeya = {
  id: 'emeya',
  kind: 'car',
  owned: true,
  flag: '🇨🇳',
  name: 'Lotus Emeya 600 SE',
  nativeName: '莲花跑车 Emeya 600 SE · 已购入 · 深圳',
  place: 'Shenzhen, China',
  currency: 'CNY',
  accent: '#f5c542',
  blurb: 'Bought: a 600 SE invoiced at ¥638,000, options included. Options are taxed too.',
  variants: [
    {
      id: '600se',
      label: 'Emeya 600 SE — 已购入 / owned',
      msrp: 588000,
      /* 450 kW, 4.15 s, 102 kWh pack; adds panoramic roof, rear-wheel steering,
         20-way massage seats over the base 600. */
      kwh100: 22, tyreSet: 9500, tyreLife: 24000,
      /* Commercial premium at the ¥588,000 list price; scaled by invoice below. */
      commercial: { low: 19050, base: 23550, high: 32050 },
    },
  ],
  defaultVariant: '600se',
  inputs: [
    { id: 'invoice', label: '成交价 Invoice total', unit: 'CNY incl. VAT', type: 'number',
      min: 588000, max: 900000, step: 1000, def: 638000,
      hint: 'What you paid, VAT and options included. Tax recomputes.' },
    { id: 'km',      label: 'Distance driven', unit: 'km/year', type: 'range', min: 3000, max: 40000, step: 1000, def: 8000 },
    { id: 'chargeMix', label: 'Home charging share', unit: '%', type: 'range', min: 0, max: 100, step: 10, def: 40,
      hint: 'No wallbox in a rented loft, so mostly public charging.' },
  ],
  rates: { home: 0.70, public: 1.40 },
  /* Optimistic = holds value best. Base 3-yr residual lands at ~49%, between the observed
     Emeya R+ resale (48.9%) and the all-BEV market average (45%). */
  depreciation: { y1: { low: 0.25, base: 0.32, high: 0.40 }, yn: { low: 0.12, base: 0.15, high: 0.18 } },

  oneTime(c) {
    const v = c.v;
    const invoice = c.in.invoice;
    const options = Math.max(0, invoice - v.msrp);
    const t = nevPurchaseTax(invoice);
    /* With the cap binding, each extra yuan of options carries the full 10%. */
    const optionTax = t.capBinds ? (options / 1.13) * 0.10 : (options / 1.13) * 0.05;
    const t2025 = (() => {
      const g = t.gross;
      return g - Math.min(g / 2, 30000); // 2025 rule: relief capped at ¥30,000
    })();
    const luxHeadroom = LUXURY_TAX_THRESHOLD_EX_VAT - t.base;

    return [
      it('capital', `成交价 — invoice total (指导价 ${cny(v.msrp)} + ${cny(options)} options)`, invoice, {
        src: SRC.emeyaPcauto,
        frequencyLabel: 'one-off',
        formula: `${cny(v.msrp)} list + ${cny(options)} options = ${cny(invoice)}`,
        facts: [
          ['Emeya 600 SE 指导价', '¥588,000'],
          ['Emeya 600 指导价', '¥538,000'],
          ['Emeya 900 (5-seat)', '¥828,000'],
          ['Emeya 900 GOLD', '¥918,000'],
          ['2024 launch entry price', '¥668,000 — cut twice since'],
          ['Your options', cny(options)],
        ],
        note: `The 600 SE lists at ${cny(v.msrp)}. Your invoice is ${cny(invoice)}, so ${cny(options)} of that is ` +
              `options and dealer-fitted extras. Lotus sells at a national uniform retail price with little ` +
              `discounting, so treat the list price as the floor.`,
      }),
      it('tax', '车辆购置税 — 2026 half-rate, relief capped at ¥15,000', t.payable, {
        src: SRC.nevTax,
        frequencyLabel: 'one-off',
        formula: `${cny(invoice)} ÷ 1.13 × 10% = ${cny(t.gross)} − ${cny(t.relief)} relief = ${cny(t.payable)}`,
        facts: [
          ['Taxable base (ex-VAT)', cny(t.base)],
          ['Statutory rate', '10%'],
          ['Gross tax', cny(t.gross)],
          ['NEV half-rate would be', cny(t.gross / 2)],
          ['Relief cap 2026–2027', '¥15,000'],
          ['Cap binds above', '≈¥339,000 invoice'],
          ['Tax on your options alone', cny(optionTax)],
          ['Same car bought in 2025', cny(t2025)],
        ],
        note: `${cny(invoice)} ÷ 1.13 = ${cny(t.base)} ex-VAT base; × 10% = ${cny(t.gross)}. The 2026–2027 NEV rule ` +
              `halves that to ${cny(t.gross / 2)}, but the relief is capped at ¥15,000 — and ${cny(t.gross / 2)} is ` +
              `${t.capBinds ? 'above' : 'below'} the cap, so ${t.capBinds ? 'the cap binds and you pay' : 'you pay'} ` +
              `${cny(t.payable)}. Your ${cny(options)} of options added ${cny(optionTax)} of tax on their own, because ` +
              `once the cap binds every extra yuan is taxed at the full 10% rather than 5%. ` +
              `The same car invoiced on or before 2025-12-31 would have paid ${cny(t2025)} — the 2026 cliff is exactly ¥15,000.`,
      }),
      it('tax', '超豪华小汽车消费税 (10% retail)', 0, {
        src: SRC.luxTax,
        frequencyLabel: 'one-off',
        facts: [
          ['Threshold (ex-VAT)', '¥900,000'],
          ['Threshold on an invoice', '≈¥1,017,000'],
          ['Your ex-VAT base', cny(t.base)],
          ['Headroom left', cny(luxHeadroom) + ' ex-VAT'],
          ['Rate if triggered', '10% of retail'],
          ['Changed 2025-07-20', 'was ¥1.3M, and BEVs were exempt'],
        ],
        note: `Not liable. The threshold is ¥900,000 EX-VAT, i.e. about ¥1,017,000 on the invoice. Your ex-VAT base ` +
              `is ${cny(t.base)}, leaving ${cny(luxHeadroom)} of headroom — you could option a further ` +
              `${cny(luxHeadroom * 1.13)} on the invoice before this 10% tax switches on. Note the base includes ` +
              `accessories, trim packages and services billed with the car.`,
      }),
      it('tax', '深圳纯电动指标 (BEV plate quota)', 0, {
        src: SRC.szQuota, frequencyLabel: 'one-off',
        facts: [
          ['BEV quota volume cap', 'none'],
          ['Lottery / auction', 'neither — eligibility review only'],
          ['Petrol plate by comparison', 'lottery or auction'],
          ['Quota validity once issued', '6 months'],
          ['Non-hukou concession ends', '2026-12-31'],
        ],
        note: 'No volume cap, no lottery, no auction — allocated on eligibility review. The non-hukou concession expires 2026-12-31.' }),
      it('fees', '上牌 / 号牌工本费 / 临牌', c.pick({ low: 300, base: 500, high: 1500 }), {
        est: true, frequencyLabel: 'one-off', src: SRC.szQuota,
        facts: [
          ['Plate blanks + temp plate + admin', '¥300–1,500'],
          ['Official Shenzhen fee schedule', 'none published — this is the weakest line here'],
          ['Linked source covers', 'the registration rules, not the fee'],
        ] }),
    ];
  },
  annual(c) {
    const v = c.v, km = c.in.km, homeShare = c.in.chargeMix / 100;
    const invoice = c.in.invoice;
    const kwh = km / 100 * v.kwh100;
    const rate = this.rates.home * homeShare + this.rates.public * (1 - homeShare);
    /* 车损险 tracks the sum insured, so the options you paid for are insured too. */
    const commercial = c.pick(v.commercial) * (invoice / v.msrp);
    return [
      it('insurance', '交强险 (compulsory third-party)', c.pick({ low: 665, base: 950, high: 950 }), {
        src: SRC.cpicJqx, frequencyLabel: 'per year',
        facts: [
          ['Base rate, ≤6 seats private', '¥950'],
          ['After 1 claim-free year', '¥855'],
          ['After 2 claim-free years', '¥760'],
          ['After 3 claim-free years', '¥665'],
          ['Guangdong floor', '¥617–665'],
          ['National floor (not applicable here)', '¥475'],
        ],
        note: 'Drops to ¥855 / ¥760 / ¥665 after one, two and three claim-free years. Guangdong has a floor around ¥617–665 — the national ¥475 floor does not apply here.',
      }),
      it('insurance', '商业险 (车损 + 300万三者 + 不计免赔 + 车上人员)', commercial, {
        src: SRC.cpicNev, est: true, frequencyLabel: 'per year',
        formula: `${cny(c.pick(v.commercial))} at list price × (${cny(invoice)} ÷ ${cny(v.msrp)}) = ${cny(commercial)}`,
        facts: [
          ['CPIC: 50万+ NEV, year 1', 'over ¥18,000'],
          ['车损险 alone, 40万+ luxury car', 'over ¥20,000'],
          ['Rate on pre-tax value', '0.5–1.2%'],
          ['NEV loading', '≈+60%'],
          ['Dealer quote, Lotus Eletre S+', '¥12,048 (thin cover)'],
          ['Industry NEV motor losses 2024', '¥5.7bn'],
        ],
        note: `Scaled to your ${cny(invoice)} invoice, because 车损险 is priced off the sum insured — the ` +
              `${cny(invoice - v.msrp)} of options are insured too, at roughly 0.5–1.2% of pre-tax value with NEVs ` +
              `loaded about 60%. This is the weakest number in the model: the Emeya has almost no Chinese loss ` +
              `history, so insurers price it defensively. Get three real quotes.`,
      }),
      it('energy', `Charging — ${Math.round(kwh).toLocaleString()} kWh at ¥${rate.toFixed(2)}/kWh`, kwh * rate, {
        src: SRC.emeyaOwner, frequencyLabel: 'per year',
        formula: `${km.toLocaleString()} km ÷ 100 × ${v.kwh100} kWh × ¥${rate.toFixed(2)} = ${cny(kwh * rate)}`,
        facts: [
          ['Battery', '102 kWh'],
          ['Official CLTC', '18.8 kWh/100km'],
          ['Owner highway test, 274 km', '20.3–21.5'],
          ['Owner summer mixed', '22–23 — used here'],
          ['Owner city / aggressive', 'up to 30'],
          ['Shenzhen home tariff, tier 1', '¥0.663/kWh'],
          ['Home blended (used)', '¥0.70'],
          ['Public off-peak', '¥0.8–1.0'],
          ['Public mid-peak (used)', '¥1.40'],
          ['Public peak', '¥1.5–2.0'],
          ['Your mix', `${Math.round(homeShare * 100)}% home / ${Math.round((1 - homeShare) * 100)}% public`],
        ],
        note: `${v.kwh100} kWh/100km is owner-measured real-world consumption, not the ${18.8} CLTC figure. Public charging in Shenzhen went fully market-priced on 2026-03-01.`,
      }),
      it('tyres', `Tyres — Michelin Pilot Sport EV, staggered 265/305`, c.pick({ low: v.tyreSet * 0.8, base: v.tyreSet, high: v.tyreSet * 1.6 }) / v.tyreLife * km, {
        src: SRC.psEvTyre, est: true, frequencyLabel: 'per year',
        formula: `${cny(c.pick({ low: v.tyreSet * 0.8, base: v.tyreSet, high: v.tyreSet * 1.6 }))} per set ÷ ${v.tyreLife.toLocaleString()} km × ${km.toLocaleString()} km`,
        facts: [
          ['Front size', '265/40 R21'],
          ['Rear size', '305/35 R21'],
          ['Front tyre, domestic', '¥1,178–1,483 each'],
          ['Rear tyre, domestic', '¥2,001–2,185 each'],
          ['EU reference price', '¥2,903 / ¥4,108 each'],
          ['Set of 4 fitted (used here)', cny(v.tyreSet)],
          ['Assumed life', v.tyreLife.toLocaleString() + ' km — LOW CONFIDENCE'],
          ['Rotatable front-to-rear?', 'No — staggered'],
        ],
        note: `¥${v.tyreSet.toLocaleString()} fitted per set, assumed ${v.tyreLife.toLocaleString()} km life. The staggered setup cannot be rotated front-to-rear. Tyre life is the single least-verified assumption in this model.`,
      }),
      it('maintenance', '保养 — scheduled servicing', c.pick({ low: 0, base: 0, high: 2100 }), {
        src: SRC.lotusFreeSvc, frequencyLabel: 'per year',
        facts: [
          ['Free scheduled servicing', '5 years, unlimited km and visits'],
          ['Pickup & delivery', 'included'],
          ['Vehicle warranty', '5 yr / 150,000 km'],
          ['Battery warranty', '8 yr / 200,000 km, ≥70% SoH'],
          ['Post-warranty benchmark (Eletre)', '≈¥2,033/yr'],
        ],
        note: 'Lotus China includes 5 years of free scheduled servicing, unlimited mileage and visits. Confirm it in your own 购车合同. Post-warranty runs about ¥2,033/yr.',
      }),
      it('parking', 'Parking — monthly card', c.pick({ low: 3600, base: 9600, high: 21600 }), {
        src: SRC.szParking, frequencyLabel: 'per year',
        formula: `${cny(c.pick({ low: 300, base: 800, high: 1800 }))}/month × 12`,
        facts: [
          ['Residential estate space', '¥300/mo'],
          ['Futian 车公庙', '¥450/mo'],
          ['Nanshan 北科大厦', '¥580/mo'],
          ['科兴科学园 / 深圳湾', '¥600/mo'],
          ['Qianhai premium tower', '¥800/mo — used here'],
          ['Car length × width', '5,139 × 2,005 mm'],
        ],
        note: 'The Emeya is 5,139 mm long and 2,005 mm wide. Verify the bay before committing — many Shenzhen spaces are sized for far smaller cars.',
      }),
      it('tax', '车船税', 0, {
        src: SRC.vesselTax, frequencyLabel: 'per year',
        facts: [
          ['BEV passenger car', 'outside the scope of the tax'],
          ['Not merely', 'an exemption that can be repealed'],
          ['2027 NEV exemption repeal', 'affects commercial BEVs, PHEVs, fuel-cell only'],
          ['Scales with mileage?', 'No — ownership tax, not a usage fee'],
        ],
        note: 'BEV passenger cars are outside the scope of the tax, not merely exempt — the 2027 repeal of NEV exemptions does not touch them. On petrol cars this line still bills every year even if the car never leaves the garage.' }),
      it('fees', '年检 (annual inspection)', 0, {
        src: SRC.szInspect, frequencyLabel: 'per year',
        facts: [
          ['Years 1–6', 'no on-line inspection'],
          ['Years 6 and 10', 'inspection required'],
          ['After year 10', 'annually'],
          ['Electronic 检验标志', 'free, every 2 years'],
          ['NEV battery safety test', 'mandatory from 2025-03-01 (GB/T 44500-2024)'],
        ],
        note: 'No physical inspection for the first 6 years. Void if the car causes a serious accident or is illegally modified.' }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 1b. Ferrari Amalfi — China                                         */
/* ------------------------------------------------------------------ */
const ferrari = {
  id: 'ferrari',
  kind: 'car',
  flag: '🇨🇳',
  name: 'Ferrari Amalfi',
  nativeName: '法拉利 Amalfi · 深圳',
  place: 'Shenzhen, China',
  accent: '#ef4444',
  currency: 'CNY',
  blurb: '¥2,598,500. Every tax the electric Emeya dodges, this one pays in full.',
  variants: [
    {
      id: 'amalfi',
      label: 'Amalfi 2026款 3.9T V8 — ¥2,598,500',
      msrp: 2598500,
      cc: 3855, lPer100: { low: 11.2, base: 15, high: 18 },
      ins: { low: 55000, base: 70000, high: 100000 },
      dep: { low: 0.07, base: 0.10, high: 0.15 },
      warn: '深圳 blocks a 粤B plate in your own name: 第十五条(三) requires no car registered in ' +
            'Shenzhen, and the Emeya is yours. 第十六条 grants a second quota for 新能源 only. A 沪牌 ' +
            'is legally open to you — Shanghai ignores out-of-town cars — but costs ~¥94,000 and twelve ' +
            'months of Shanghai social insurance. Pick the plate route before the budget.',
    },
  ],
  defaultVariant: 'amalfi',
  inputs: [
    { id: 'options', label: '选配 Options', unit: 'CNY incl. VAT', type: 'number',
      min: 0, max: 900000, step: 10000, def: 300000,
      hint: 'Taxed twice over: 10% purchase tax and 10% luxury tax.' },
    { id: 'km', label: 'Distance driven', unit: 'km/year', type: 'range', min: 2000, max: 20000, step: 1000, def: 6000 },
    { id: 'plate', label: '牌照 route', type: 'select', def: 'company',
      options: [
        { v: 'company', l: '粤B 单位竞价 — company name, ~¥11,000' },
        { v: 'family', l: '粤B 个人竞价 — a family member, ~¥13,000' },
        { v: 'shanghai', l: '沪牌 拍卖 — ~¥94,000, in your own name' },
        { v: 'outoftown', l: '非粤B — free, banned on weekday peaks' },
      ],
      hint: '粤B is closed to you personally while you own the Emeya.' },
  ],
  rates: { petrol: 11.00 },

  oneTime(c) {
    const v = c.v;
    const options = c.in.options;
    const invoice = v.msrp + options;
    const exVat = invoice / 1.13;
    const purchaseTax = exVat * 0.10;
    const luxOnOptions = (options / 1.13) * 0.10;
    const luxEmbedded = (v.msrp / 1.13) * 0.10;
    const plate = {
      company: 11000,
      family: 13000,
      /* 沪牌 clears in a narrow band every month; 2026 has run ¥93,600–94,391. */
      shanghai: c.pick({ low: 93600, base: 93868, high: 94400 }),
      outoftown: 0,
    }[c.in.plate];

    return [
      it('capital', `成交价 — 指导价 ${cny(v.msrp)} + ${cny(options)} 选配`, invoice, {
        src: SRC.amalfiPrice, frequencyLabel: 'one-off',
        formula: `${cny(v.msrp)} + ${cny(options)} = ${cny(invoice)}`,
        facts: [
          ['China 指导价', '¥2,598,500 (launched 2025-10-16)'],
          ['Engine', '3,855 cc twin-turbo V8, 640 cv'],
          ['0–100 km/h', '3.3 s · top speed 320 km/h'],
          ['Italy list', '€240,000 incl. IVA'],
          ['USA', 'USD 266,810'],
          ['Predecessor Roma 指导价', '¥2,418,000'],
          ['Order lead time', '≈1 year, into Q4 2027'],
          ['Discounting', 'none — there is a queue'],
        ],
        note: 'Single trim in China. Roughly 41% of this sticker is already tax: 15% tariff, 25% ' +
              'import consumption tax on a 3.0–4.0L engine, 10% embedded luxury tax and 13% VAT. ' +
              'At 3,855 cc it sits 145 cc under the 4.0L cliff where import consumption tax jumps to 40%.',
      }),
      it('tax', '车辆购置税 — full 10%, no NEV relief', purchaseTax, {
        src: SRC.nevTax, frequencyLabel: 'one-off',
        formula: `${cny(invoice)} ÷ 1.13 × 10% = ${cny(purchaseTax)}`,
        facts: [
          ['Rate for an ICE car', '10%, no relief of any kind'],
          ['Ex-VAT taxable base', cny(exVat)],
          ['Tax payable', cny(purchaseTax)],
          ['Your Emeya paid', '¥41,460 on ¥638,000'],
          ['NEV relief this car gets', '¥0 — petrol'],
          ['Tax from the options alone', cny((options / 1.13) * 0.10)],
        ],
        note: 'The Emeya got the capped new-energy half-rate. A petrol car gets nothing: the full ' +
              '10% of the ex-VAT invoice, options included.',
      }),
      it('tax', '超豪华小汽车消费税 — 10% on the options', luxOnOptions, {
        src: SRC.luxTaxGov, frequencyLabel: 'one-off',
        formula: `${cny(options)} ÷ 1.13 × 10% = ${cny(luxOnOptions)}`,
        facts: [
          ['Threshold', '¥900,000 ex-VAT — this car is 2.6× over'],
          ['Rate', '10%, 零售环节加征'],
          ['Taxpayer', 'the dealer, not you — it is a 价内税'],
          ['Embedded in the ¥2,598,500 sticker', cny(luxEmbedded)],
          ['Ferrari in scope since', '2016-12-01, so the MSRP already absorbs it'],
          ['Base includes', '精品, 配饰 and 服务 billed with the car'],
          ['Splitting the invoice', 'back-tax, late fees and audit'],
          ['Used resale', 'exempt since 2025-07-20'],
        ],
        note: 'Ferrari has been above this threshold since the tax was created in 2016, so the sticker ' +
              'already contains ' + cny(luxEmbedded) + ' of it — that is not a second cheque. Your options are ' +
              'the genuinely new exposure. Get the contract to say 含超豪华消费税 in writing: one 2018 court ' +
              'case saw a Bentley buyer billed ¥373,000 as if it were withholding on their behalf.',
      }),
      it('tax', {
        company: '粤B 牌照 — 单位竞价, titled to a company',
        family: '粤B 牌照 — 个人竞价 in a family member\u2019s name',
        shanghai: '沪牌 — 个人非营业性客车额度拍卖',
        outoftown: '非粤B 牌照 — free, and restricted',
      }[c.in.plate], plate, {
        src: c.in.plate === 'shanghai' ? SRC.shPlateResult
          : c.in.plate === 'outoftown' ? SRC.szOutOfTown
          : SRC.szPlateAuction,
        frequencyLabel: 'one-off',
        est: c.in.plate === 'shanghai',
        formula: c.in.plate === 'shanghai'
          ? '2026 monthly averages ¥93,600–94,391; 第8期 均价 ¥93,868 used here'
          : undefined,
        facts: c.in.plate === 'shanghai'
          ? [
            ['2026 第8期 均价', '¥93,868 · 中标率 14.4%'],
            ['2026 range', '¥93,600–94,391 — flat all year'],
            ['警示价 (floor)', '¥92,900'],
            ['Win rate, Jan–Aug 2026', '8.9% → 14.4%'],
            ['Expected attempts', '≈7 months at the current rate'],
            ['名下有外地车', 'does NOT block the bid — 沪牌 only excludes 沪 quota cars'],
            ['Non-沪籍 requirement', '上海居住证 + 连续满1年在沪社保或个税'],
            ['Eased in Feb 2025', 'from 3 years to 1 year'],
            ['Deposit / fee', '¥1,000 refundable + ¥60 per auction'],
            ['Transfer lock', '3 years from activation'],
            ['In Shenzhen it is still 非粤B', 'same weekday peak ban'],
          ]
          : c.in.plate === 'outoftown'
          ? [
            ['Cost', '¥0 — no auction, no lottery'],
            ['Banned', 'Mon–Fri 07:00–09:00 and 17:30–19:30, citywide'],
            ['Free days', '1/month citywide + 2/month each in 盐田, 光明, 大鹏'],
            ['Weekends & public holidays', 'no restriction at all'],
            ['Penalty', 'first 2 free per notice period, then ¥300 + 1 point'],
            ['Same-day repeat captures', 'counted once'],
            ['Current notice', '2026-09-17 to 2027-09-16'],
            ['Exempt plates', 'HK, Macau and consular'],
          ]
          : [
            ['2026 第8期 个人均价', '¥11,670'],
            ['2026 第8期 单位均价', '¥10,678'],
            ['Auction reserve floor', '¥10,000'],
            ['2026 第5期 个人均价', '¥16,421 — falling all year'],
            ['Lottery odds, 第7期', '0.112%'],
            ['Annual 普通 quota cap', '80,000'],
            ['BEV quota by comparison', 'free, uncapped, no lottery'],
            ['Closed to you personally', '第十五条(三) — you own the Emeya'],
          ],
        note: {
          company:
            'A company quota needs a Shenzhen-registered firm that paid ¥50,000 of local tax last year, ' +
            'and the car is titled to the company, not to you.',
          family:
            'Cheap, but the plate and the car both belong to whoever bids. 第十五条(三) closes 个人竞价 to ' +
            'you personally for as long as the Emeya is registered in Shenzhen.',
          shanghai:
            'The one route that puts a petrol Ferrari on a plate in your own name. Shanghai only excludes ' +
            'people who already hold a Shanghai quota or a car registered on one — the 交通委 FAQ says a ' +
            'car on another city\u2019s plate needs no deregistration — so the Emeya is irrelevant here. ' +
            'The real price is not the ¥93,868: it is 上海居住证 plus twelve unbroken months of Shanghai ' +
            'social insurance or income tax, then roughly seven monthly auctions at a 14% win rate. And ' +
            'in Shenzhen a 沪牌 is just another 非粤B plate, banned on the same weekday peaks — so it only ' +
            'pays for itself if the car is actually kept in Shanghai.',
          outoftown:
            'Free, and for a car you drive at weekends the restriction barely bites: the ban is weekday ' +
            'peaks only, and weekends and public holidays are untouched. This is the rational choice ' +
            'unless you need the car on a Tuesday morning.',
        }[c.in.plate],
      }),
      it('fees', '上牌 / 号牌工本费', c.pick({ low: 373, base: 500, high: 1500 }), {
        src: SRC.szQuota, est: true, frequencyLabel: 'one-off',
        facts: [['上牌一条龙', '≈¥500'], ['DIY', '≈¥373'], ['Company registration', 'adds admin']],
      }),
    ];
  },
  annual(c) {
    const v = c.v, km = c.in.km;
    const litres = km * c.pick(v.lPer100) / 100;
    const insured = v.msrp + c.in.options;
    return [
      it('insurance', '交强险 + 商业险 (车损 + 三者 + 划痕)', c.pick(v.ins) * (insured / v.msrp), {
        src: SRC.romaInsurance, est: true, frequencyLabel: 'per year',
        facts: [
          ['交强险, year 1', '¥950'],
          ['Roma 车损险', '¥54,000/yr'],
          ['Roma full package', '¥57,600–60,000/yr'],
          ['Scaled to the Amalfi', '¥58,031 车损险'],
          ['¥3M-class Ferrari market quote', '≈¥100,000/yr'],
          ['F8 Tributo, for scale', '¥353,000/yr'],
          ['燃油车 零整比 index', '390.77% (第21期)'],
          ['Ferrari 零整比', 'not published — insurers have no benchmark'],
          ['Shenzhen 三者险 loading', '+30–50% vs tier-3 cities'],
        ],
        note: 'The real risk is not the price but availability: CPIC\'s own consumer material documents ' +
              'insurers refusing 车损险 on Ferraris and writing liability cover only. Get a binding quote ' +
              'in writing before you place the order, not after.',
      }),
      it('energy', `98号汽油 — ${Math.round(litres).toLocaleString()} L at ¥${this.rates.petrol.toFixed(2)}/L`, litres * this.rates.petrol, {
        src: SRC.sz98Petrol, frequencyLabel: 'per year',
        formula: `${km.toLocaleString()} km × ${c.pick(v.lPer100)} L/100km × ¥${this.rates.petrol.toFixed(2)} = ${cny(litres * this.rates.petrol)}`,
        facts: [
          ['广东 98号, 2026-09-12', '¥11.00/L — the dearest province'],
          ['National average', '¥10.13/L'],
          ['2026 range in Guangdong', '¥9.80 – ¥11.53'],
          ['Official WLTP combined', '11.2 L/100km'],
          ['WLTP urban phase', '19.7 L/100km'],
          ['Independent real-world', '14–18 L/100km'],
          ['Chinese owner report', '市区 15 L/100km 起步'],
          ['Tank', '80 L, 98 RON mandatory'],
          ['Emeya per 10,000 km', '≈¥1,200 — this car is ~14×'],
        ],
      }),
      it('tax', '车船税 — 广东, 3.0–4.0L band', 2400, {
        src: SRC.gdVesselTax, frequencyLabel: 'per year',
        facts: [
          ['广东 3.0–4.0L', '¥2,400/yr'],
          ['广东 >4.0L', '¥3,600/yr'],
          ['广东 2.5–3.0L', '¥1,200/yr'],
          ['This car', '3,855 cc — top of the band'],
          ['Legal basis', '粤府〔2022〕81号, valid to 2027-12-31'],
          ['Collected by', 'your insurer, with 交强险'],
          ['Your Emeya (BEV)', '¥0 — outside the tax entirely'],
          ['Scales with mileage?', 'No — ownership tax'],
          ['Weekend-only / garage queen', 'still ¥2,400/yr'],
        ],
        note: 'This is an ownership tax collected with 交强险 once a year. Driving only on weekends — or not at all — does not reduce it. Fuel, tyres and brakes are what scale with how often you drive.',
      }),
      it('maintenance', '保养 — Ferrari 7年原厂保养计划', c.pick({ low: 0, base: 0, high: 8000 }), {
        src: SRC.ferrari7yr, frequencyLabel: 'per year',
        facts: [
          ['Cost, years 1–7', '¥0 — free, confirmed for China'],
          ['Interval', 'annual OR every 20,000 km'],
          ['Covers', 'labour, OEM parts, lubricants, engine oil, brake fluid'],
          ['Does NOT cover', 'tyres, brakes, clutch, wipers'],
          ['Transferable on resale', 'yes'],
          ['Year 8+ routine service', '¥10,000–15,000/yr'],
          ['Major service', 'up to ¥50,000'],
          ['Porsche / Lamborghini by comparison', '¥5,000–6,000 / ¥9,000–12,000 per year from new'],
          ['Ferrari dealers in Shenzhen', '1 — 骏佳行, service in 坂田'],
        ],
        note: 'Genuinely generous, and cheaper than any rival for seven years. The catch is the 20,000 km ' +
              'ceiling and the single service point across town in Bantian, which leaves you no leverage ' +
              'on out-of-schedule work.',
      }),
      it('tyres', 'Tyres — 245/35 R20 front, 285/35 R20 rear', c.pick({ low: 12000, base: 14000, high: 16000 }) / 20000 * km, {
        src: SRC.amalfiTyres, est: true, frequencyLabel: 'per year',
        formula: `${cny(c.pick({ low: 12000, base: 14000, high: 16000 }))} per set ÷ 20,000 km × ${km.toLocaleString()} km`,
        facts: [
          ['Front', '245/35 R20 on 8.0J'],
          ['Rear', '285/35 R20 on 10.0J'],
          ['OE brands', 'Bridgestone Potenza Sport, Pirelli P Zero'],
          ['Ferrari homologation codes', 'F02 front, F03 rear'],
          ['Set of 4 fitted, China', '¥12,000–16,000'],
          ['Assumed life', '20,000 km — rears wear much faster'],
          ['Non-OE fitment', 'queried at resale'],
        ],
      }),
      it('maintenance', 'Brakes — carbon-ceramic, amortised', c.pick({ low: 2000, base: 4000, high: 20000 }), {
        src: SRC.ferrariBrakes, est: true, frequencyLabel: 'per year',
        facts: [
          ['Discs', '390 mm front / 360 mm rear, CCM standard'],
          ['Full CCM replacement', '¥129,000–200,000'],
          ['OEM pads, per set', '¥6,000–8,000'],
          ['Pad life, street', '30,000–50,000 km'],
          ['Pad life, track', '10,000–20,000 km'],
          ['CCM disc life, road use', 'usually the life of the car'],
          ['Salvage discs', '¥30,000–50,000/pair — counterfeits circulate'],
        ],
        note: 'Carbon-ceramic discs rarely wear out on road use, so the base case is pads only. The high ' +
              'case is the tail: crack a rotor and it is a six-figure event in one invoice.',
      }),
      it('maintenance', 'Clutch — F1 DCT, amortised', c.pick({ low: 500, base: 1200, high: 2500 }), {
        src: SRC.ferrariParts, est: true, frequencyLabel: 'per year',
        facts: [
          ['OEM clutch plates', '¥8,000–10,000'],
          ['Aftermarket', '¥3,000–5,000'],
          ['Fitting labour', '¥1,500–2,000'],
          ['Inspection interval', 'every 80,000–100,000 km'],
          ['Full DCT assembly, worst case', '¥150,000–200,000'],
        ],
      }),
      it('parking', 'Parking — secure indoor bay', c.pick({ low: 6000, base: 14400, high: 24000 }), {
        src: SRC.szParkingMkt, frequencyLabel: 'per year',
        formula: `${cny(c.pick({ low: 500, base: 1200, high: 2000 }))}/month × 12`,
        facts: [
          ['Government base, residential indoor', '¥250/mo'],
          ['Nanshan market rate', '¥1,000–2,000/mo'],
          ['Futian market rate', '¥800–1,500/mo'],
          ['Car width', '1,974 mm excluding mirrors'],
          ['Standard PRC bay', '2,500 mm — ≈250 mm total clearance'],
          ['Car height / length', '1,301 mm / 4,660 mm'],
          ['Biggest damage risk', 'neighbouring door strikes, then ramps'],
        ],
        note: 'Specify the front-lift system. Shenzhen\'s speed humps and garage ramp transitions are the ' +
              'likeliest way to destroy the splitter, and a shared public bay leaves ~25 cm of door clearance.',
      }),
      it('fees', '年检 — amortised', c.pick({ low: 0, base: 50, high: 300 }), {
        src: SRC.szInspect, frequencyLabel: 'per year',
        facts: [
          ['Years 1–6', 'exempt, e-label only'],
          ['On-line test at', 'year 6 and year 10'],
          ['After year 10', 'annually'],
          ['ICE fee', '¥200–300 — includes the emissions test'],
          ['BEV fee', '¥160–210'],
          ['Exemption forfeited by', '非法改装, or registering >4 yrs after build'],
        ],
      }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 2. Shenzhen loft                                                   */
/* ------------------------------------------------------------------ */
const loft = {
  id: 'loft',
  kind: 'home',
  flag: '🇨🇳',
  name: 'Shenzhen loft',
  nativeName: '深圳 复式 LOFT',
  place: 'Shenzhen, China',
  currency: 'CNY',
  accent: '#ff6b6b',
  blurb: 'A high-ceiling duplex loft. The market is soft, so the rent rise is negotiable.',
  variants: [
    { id: 'nanshan', label: '南山 科技园 / 南油 — ¥8,000', rent: { low: 6800, base: 8000, high: 12000 }, sqm: 60, mgmt: 9,  src: SRC.loftNanshan },
    { id: 'futian',  label: '福田 中心 / 皇岗 — ¥11,000',  rent: { low: 9000, base: 11000, high: 15000 }, sqm: 57, mgmt: 9,  src: SRC.loftFutian },
    { id: 'baoan',   label: '宝安 中心 / 前海周边 — ¥6,000', rent: { low: 4000, base: 6000, high: 8500 }, sqm: 65, mgmt: 6,  src: SRC.loftBaoan },
    { id: 'longhua', label: '龙华 — ¥4,000',              rent: { low: 2500, base: 4000, high: 6000 }, sqm: 55, mgmt: 5.16, src: SRC.loftBaoan },
  ],
  defaultVariant: 'nanshan',
  inputs: [
    { id: 'mgmtPayer', label: '物业管理费 paid by', type: 'select', def: 'tenant',
      options: [{ v: 'tenant', l: 'Me (check the contract!)' }, { v: 'landlord', l: 'Landlord — priced into rent' }] },
    { id: 'agency', label: 'Letting channel', type: 'select', def: 'agent',
      options: [{ v: 'agent', l: 'Via agent — 中介费 0.5 month' }, { v: 'direct', l: 'Operator-direct — 无中介费' }] },
  ],
  escalation: { low: 0, base: 0.03, high: 0.05 },

  oneTime(c) {
    const rent = c.pick(c.v.rent);
    const months = c.pick({ low: 1, base: 2, high: 3 });
    return [
      it('fees', `押金 — ${months} month${months > 1 ? 's' : ''} deposit`, rent * months, {
        refundable: true, src: SRC.szRentalLaw, frequencyLabel: 'one-off, refundable',
        formula: `${cny(rent)}/month × ${months} months`,
        facts: [
          ['泊寓 branded loft', '押一付一'],
          ['紫元元大厦 (Futian)', '押二付一'],
          ['安居客 博客公寓', '付1押2'],
          ['Textbook convention', '押一付三 — NOT what listings show'],
          ['Law in force', '住房租赁条例, 2025-09-15'],
          ['Must be in the contract', 'amount, return timing, deduction grounds'],
        ],
        note: '押二付一 dominates current loft listings, not the textbook 押一付三. Under the 住房租赁条例 (in force 2025-09-15) the deposit amount, return timing and deduction grounds must all be written into the contract.',
      }),
      it('fees', '中介费 (agency fee)', c.in.agency === 'direct' ? 0 : rent * c.pick({ low: 0.5, base: 0.5, high: 1 }), {
        src: SRC.szAgency, frequencyLabel: 'one-off',
        facts: [
          ['Shenzhen convention', '1 month total, split 50/50'],
          ['Tenant share', '0.5 month'],
          ['Operator-direct (泊寓, 贝壳公寓)', '¥0 — no agency fee'],
          ['Off-season discount', '≈10%'],
        ],
        note: 'Shenzhen convention is one month total, split 50/50 with the landlord. Renting operator-direct (泊寓, 贝壳公寓, building-direct) removes it entirely.',
      }),
      it('utilities', 'Broadband installation', 100, {
        src: SRC.szBroadband, frequencyLabel: 'one-off',
        facts: [['China Mobile install fee', '¥100'], ['Waived if', 'the building has a bulk contract']] }),
    ];
  },
  annual(c) {
    const rent = c.pick(c.v.rent);
    const sqm = c.v.sqm;
    return [
      it('rent', `Rent — ¥${rent.toLocaleString()}/month`, rent * 12, {
        escalate: 'rent', src: c.v.src, frequencyLabel: 'per year',
        formula: `${cny(rent)}/month × 12`,
        facts: [
          ['Shenzhen average, May 2026', '82.47 ¥/㎡/month'],
          ['Institutional apartment average', '95.29 ¥/㎡/month'],
          ['Nanshan + Futian', '4.59–5.48 ¥/㎡/day'],
          ['Bao\u2019an / Longhua / Longgang', '2.12–2.26 ¥/㎡/day'],
          ['南油 阳光科创中心, 50㎡ 复式', '¥6,800/month'],
          ['福田 紫元元大厦, 56.69㎡ loft', '¥10,000–10,500'],
          ['Market trend H1 2026', '−4.2% YoY on institutional yield'],
          ['This unit', `${c.v.sqm} ㎡`],
        ],
      }),
      it('utilities', 'Electricity — residential tariff', c.pick({ low: 150, base: 280, high: 550 }) * 12, {
        src: SRC.szElecConvert, frequencyLabel: 'per year',
        formula: `${cny(c.pick({ low: 150, base: 280, high: 550 }))}/month × 12`,
        facts: [
          ['Residential tier 1', '¥0.66287/kWh'],
          ['Tier 2', '¥0.71287'],
          ['Tier 3', '¥0.96287'],
          ['Flat 合表电价', '¥0.69987'],
          ['Summer tier breakpoints', '260 / 600 kWh'],
          ['Landlords fined for charging', '¥0.98, ¥1.00, ¥1.20, ¥1.50'],
          ['Convert via', '南网在线 APP or 95598, ≤30 days'],
        ],
        note: 'The "lofts pay commercial rates" belief is the most expensive myth here. Shenzhen DRC lets a 商务类公寓 used as a home convert to the residential tariff (¥0.663–0.963/kWh), and landlords have been fined for charging ¥0.98–1.50. Ask to see the meter and the invoice.',
      }),
      it('utilities', 'Water & sewage', c.pick({ low: 25, base: 40, high: 70 }) * 12, {
        src: SRC.szWater, frequencyLabel: 'per year',
        facts: [
          ['Tier 1 (0–22 m³/mo)', '¥2.67 + ¥1.00 sewage = ¥3.67/m³'],
          ['Tier 2 (22–30 m³)', '¥6.04/m³'],
          ['Tier 3 (>30 m³)', '¥12.35/m³'],
          ['合表用户 flat', '¥4.75/m³'],
          ['非居民 commercial', '¥6.30/m³'],
          ['Effective', '2025-07-01'],
        ],
        note: 'Tier 1: ¥2.67 supply + ¥1.00 sewage = ¥3.67/m³.' }),
      it('utilities', 'Gas', c.pick({ low: 0, base: 0, high: 70 }) * 12, {
        src: SRC.szWater, frequencyLabel: 'per year',
        facts: [
          ['Residential tier 1', '¥3.41/m³'],
          ['Tier 2 / Tier 3', '¥3.91 / ¥5.16'],
          ['Most lofts', 'no gas line — induction hob only'],
        ],
        note: 'Most Shenzhen lofts have no gas connection — induction hob only.' }),
      it('fees', `物业管理费 — ¥${c.v.mgmt}/㎡/month × ${sqm} ㎡`, c.in.mgmtPayer === 'landlord' ? 0 : c.v.mgmt * sqm * 12, {
        src: SRC.szPropMgmt, frequencyLabel: 'per year',
        formula: `¥${c.v.mgmt}/㎡ × ${sqm} ㎡ × 12 months`,
        facts: [
          ['公寓 classification', '非住宅 — market-priced, no cap'],
          ['Residential ceiling (does NOT apply)', '¥3.9/㎡/month'],
          ['福田 紫元元大厦, observed', '¥9.00/㎡/month'],
          ['Futian premium apartments', '¥12–18/㎡/month'],
          ['Longhua older stock', '¥5.16/㎡/month'],
          ['深圳湾一号 benchmark', '¥33/㎡/month'],
          ['Annual increases', '3–8%'],
        ],
        note: '公寓 is classified 非住宅, so the ¥3.9/㎡ residential ceiling does NOT protect you. Observed range is ¥5.16 to ¥18/㎡/month.',
      }),
      it('utilities', 'Broadband — 1000M', c.pick({ low: 480, base: 1200, high: 2160 }), {
        src: SRC.szBroadband, frequencyLabel: 'per year',
        facts: [
          ['深圳移动 300M', '¥480/yr'],
          ['深圳移动 500M', '¥720/yr'],
          ['深圳移动 1000M', '¥1,200/yr — used here'],
          ['深圳电信 1000M', '¥290/month'],
          ['Installation', '¥100 one-off'],
        ],
      }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 3. Nissan GT-R R35 — Japan                                         */
/* ------------------------------------------------------------------ */
const gtr = {
  id: 'gtr',
  kind: 'car',
  flag: '🇯🇵',
  name: 'Nissan GT-R',
  nativeName: '日産 GT-R (R35) · 中古 · 東京',
  place: 'Tokyo, Japan',
  currency: 'JPY',
  accent: '#ff4d6d',
  blurb: 'Used, ~¥11.4M. Insurers will only cover an early car for half what you pay.',
  variants: [
    {
      id: 'early',
      label: 'MY07–MY11 (2008–2011), 40–70k km — ¥9.3M',
      price: { low: 9000000, base: 9300000, high: 9900000 },
      appr: { low: 0.04, base: -0.01, high: -0.04 },
      ins: { low: 40000, base: 50000, high: 130000 },
      hullValue: 4500000,
      roadTax: 76400, weightTax: 22800,
      shaken: { low: 49000, base: 120000, high: 231000 },
      contingency: { low: 200000, base: 400000, high: 800000 },
      gr6: { low: 0, base: 550000, high: 610000 },
      hullWall: 2028,
      warn: 'Un-remediated early cars carry a ¥1.4M–2.7M gearbox risk, parts are already being ' +
            'discontinued, and 車両保険 disappears entirely at 20 years from registration — 2028 for a 2008 car.',
    },
    {
      id: 'mid',
      label: 'MY12–MY16 (2013–2016), 20–50k km — ¥11.5M',
      price: { low: 11000000, base: 11500000, high: 12500000 },
      appr: { low: 0.05, base: 0.01, high: -0.02 },
      ins: { low: 55000, base: 75000, high: 150000 },
      hullValue: 8000000,
      roadTax: 66500, weightTax: 16400,
      shaken: { low: 47000, base: 95000, high: 175000 },
      contingency: { low: 120000, base: 250000, high: 500000 },
      gr6: { low: 0, base: 0, high: 550000 },
      hullWall: 2033,
      warn: 'Road tax steps up to ¥76,400 and weight tax to ¥45,600 as the car passes 13 years — ' +
            'FY2028 for a 2014 car, FY2029 for a 2015.',
    },
    {
      id: 'facelift',
      label: 'MY17 facelift (2018), 70k km — ¥12.48M',
      price: { low: 12480000, base: 12480000, high: 13600000 },
      appr: { low: 0.05, base: 0.01, high: -0.02 },
      ins: { low: 60000, base: 85000, high: 170000 },
      hullValue: 9500000,
      roadTax: 66500, weightTax: 16400,
      shaken: { low: 47000, base: 95000, high: 160000 },
      contingency: { low: 80000, base: 150000, high: 350000 },
      gr6: { low: 0, base: 0, high: 0 },
      hullWall: 2038,
      warn: null,
    },
  ],
  defaultVariant: 'mid',
  inputs: [
    { id: 'km',      label: 'Distance driven', unit: 'km/year', type: 'range', min: 1000, max: 20000, step: 500, def: 4000 },
    { id: 'workshop',label: 'Where you service it', type: 'select', def: 'dealer',
      options: [{ v: 'dealer', l: 'Nissan dealer — keeps the warranty' }, { v: 'specialist', l: 'GT-R specialist — cheaper, risks cover' }] },
    { id: 'tyre',    label: 'Tyre choice', type: 'select', def: 'oe',
      options: [{ v: 'oe', l: 'OE Dunlop GT600 run-flats — ¥299,200/set' }, { v: 'alt', l: 'Michelin PS4S non-run-flat — ¥195,400/set' }] },
  ],
  rates: { fuel: 180.90, kmPerL: 7.25 },

  oneTime(c) {
    const v = c.v;
    return [
      it('capital', 'Vehicle price (used, 車両本体)', c.pick(v.price), {
        src: SRC.gooNetCheap, frequencyLabel: 'one-off',
        facts: [
          ['goo-net listings', '193 cars'],
          ['Full price range', '¥7.85M – ¥62.8M'],
          ['Market average listing', '¥19.83M'],
          ['In the ¥9–12.5M band', '≈33 cars (17%)'],
          ['2011 Black, 51,000 km', '¥9.30M 総額'],
          ['2013 Premium, 52,000 km', '¥10.35M, NHPC-inspected'],
          ['2018 facelift, 70,000 km', '¥12.48M'],
          ['修復歴あり discount', 'only ≈10% — resells at −30–50%'],
        ],
        note: 'About 33 of 193 listed cars sit in the ¥9–12.5M band. Note that 修復歴あり (accident history) is only ~10% cheaper in this market but resells at a 30–50% penalty — strictly negative expected value.',
      }),
      it('tax', '環境性能割', 0, {
        src: SRC.jpKankyoGone, frequencyLabel: 'one-off',
        facts: [
          ['Abolished', '2026-03-31'],
          ['Applies to', 'new AND used registrations'],
          ['Old rate', '≈3% of value'],
          ['Saved on this purchase', '≈¥200,000–300,000'],
        ],
        note: 'Abolished 2026-03-31 for new AND used registrations, saving roughly ¥200–300k versus the old 3% rate. Every guide written before this year still includes it.',
      }),
      it('fees', '諸費用 — 登録, 車庫証明, リサイクル, 自賠責, 納車整備', c.pick({ low: 150000, base: 200000, high: 400000 }), {
        src: SRC.gooNetCheap, est: true, frequencyLabel: 'one-off',
        facts: [
          ['Observed range in listings', '¥88,000 – ¥400,000'],
          ['移転登録手数料 (statutory)', '¥700'],
          ['検査登録代行', '¥20,000–50,000'],
          ['車庫証明 + 代行', '¥12,000–25,000'],
          ['リサイクル預託金', '¥10,000–18,000'],
          ['納車整備', '¥20,000–50,000'],
          ['Cars sold 車検なし', '¥380,000–400,000 — real prep'],
        ],
        note: 'Observed range across real listings is ¥88,000–400,000. The ¥380–400k examples are cars sold 車検なし where the dealer bundles a fresh inspection and a 12-month warranty — that is the honest price of an old R35 properly prepared.',
      }),
      it('maintenance', 'GT-R diagnostics before you pay (CONSULT engine + gearbox scan)', 17280, {
        src: SRC.gtnetShaken, frequencyLabel: 'one-off',
        facts: [
          ['GTNET engine + gearbox scan', '¥8,640'],
          ['Transmission adjustment', '¥8,640'],
          ['A general used-car dealer', 'will not do either'],
        ],
        note: 'GTNET charges ¥8,640 for the scan and ¥8,640 for transmission adjustment. Trivial money, non-negotiable — a general used-car dealer will not do it.',
      }),
      it('maintenance', 'GR6 preventive programme (強化Cリング, clutch clearance, solenoid)', c.pick(v.gr6), {
        src: SRC.gtrEndless, frequencyLabel: 'one-off',
        facts: [
          ['ENDLESS アッパープログラム', '¥500,000 ex-tax (≈¥550,000)'],
          ['DUKE FUKUI 対策メニュー', '¥400,000 ex-tax (≈¥440,000)'],
          ['If the C-ring breaks — light damage', '+¥100,000'],
          ['If it breaks — heavy damage', '¥1,400,000+'],
          ['Nissan HPC repair', '¥1,000,000+'],
          ['Nissan ASSY replacement', '¥2,700,000+'],
          ['At-risk chassis numbers', 'before 5400番台'],
          ['Clutch seals typically fail', '60,000–100,000 km'],
        ],
        note: 'ENDLESS charges ¥500,000 ex-tax, DUKE ¥400,000 ex-tax. Treat this as part of the purchase price on an early car, not optional maintenance: the reactive path if the C-ring lets go is ¥1.4M–2.7M. Skip it only if the car has documented recent gearbox work — three such cars were in the listings.',
      }),
    ];
  },
  annual(c) {
    const v = c.v, km = c.in.km;
    const litres = km / this.rates.kmPerL;
    const tyreSet = c.in.tyre === 'oe' ? 299200 : 195400;
    const tyreLife = c.pick({ low: 25000, base: 20000, high: 12000 });
    const dealer = c.in.workshop === 'dealer';
    return [
      it('tax', `自動車税 — 3,799 cc${v.roadTax === 76400 ? ', 13-year 重課' : ''}`, v.roadTax, {
        frequencyLabel: 'per year',
        facts: [
          ['Band', '3,500–4,000 cc'],
          ['Registered ≤2019-09-30', '¥66,500'],
          ['Registered ≥2019-10-01', '¥65,500'],
          ['13-year 重課 (+15%)', '¥76,400'],
          ['重課 catches registrations', 'on or before 2013-03-31'],
          ['Trigger', 'first 1 April after the 13th anniversary'],
          ['Penalty vs a younger car', '¥9,900/yr'],
        ],
        src: v.roadTax === 76400 ? SRC.jpJuukaTrigger : SRC.jpRoadTax,
        note: v.roadTax === 76400
          ? 'The surcharge catches every car registered on or before 2013-03-31, and it bites from the first 1 April after the 13th anniversary. It is only ¥9,900/yr more, though — do not let it drive your choice of year. Ownership tax: mileage does not change it.'
          : 'Rises to ¥76,400 once the car passes 13 years. Note the FY2027 reform will redesign this tax around weight and emissions from FY2028 — a 3,799 cc, 1,760 kg car is exposed on both axes. Ownership tax: weekend-only driving does not reduce it.',
      }),
      it('tax', `自動車重量税 — annualised (1,760 kg${v.weightTax > 16400 ? ', 13yr+ band' : ''})`, v.weightTax, {
        src: SRC.jpWeightTax, frequencyLabel: 'per year',
        formula: `¥${(v.weightTax * 2).toLocaleString()} per 2-year 車検 ÷ 2`,
        facts: [
          ['Kerb weight', '1,760 kg → 1.5–2.0 t band'],
          ['Under 13 years', '¥32,800 / 2 yr'],
          ['13 years and over', '¥45,600 / 2 yr'],
          ['18 years and over', '¥50,400 / 2 yr'],
          ['Trigger', 'actual registration anniversary at inspection'],
        ],
        note: '¥32,800 per 2-year 車検 under 13 years, ¥45,600 from 13, ¥50,400 from 18. Unlike the road tax, the trigger is the actual registration anniversary measured at the inspection date.',
      }),
      it('insurance', '自賠責保険 — annualised', 9280, {
        src: SRC.jpJibaiseki, frequencyLabel: 'per year',
        formula: '¥18,560 per 24 months ÷ 2',
        facts: [
          ['24 months, policies to 2026-10-31', '¥17,650'],
          ['24 months, from 2026-11-01', '¥18,560'],
          ['Change', '+5.2%, first in 13 years'],
          ['Set by', 'policy start date, not purchase date'],
        ],
        note: 'The 24-month premium rises 5.2% to ¥18,560 for policies starting 2026-11-01 — the first change in 13 years, and you would be buying after it.',
      }),
      it('insurance', `任意保険 — 車両保険 agreed value only ¥${(v.hullValue / 1e6).toFixed(1)}M`, c.pick(v.ins), {
        src: SRC.gtrIns723, frequencyLabel: 'per year',
        facts: [
          ['Real quote, アクサダイレクト, 2008 car', '¥44,700 @ ¥4.45M agreed value'],
          ['Real quote, イーデザイン損保', '¥38,210 @ ¥4.35–4.9M'],
          ['Modelled, 20等級, ¥8.6M cover', '¥140,000'],
          ['料率クラス 対人 / 対物', '1 / 1 — the cheapest possible'],
          ['料率クラス 車両', '10–12'],
          ['If anyone under 30 drives', '¥107,000+'],
          ['Agency-type vs direct', '2–3× dearer'],
          ['Hull cover lost at', `20 yrs from registration — ${v.hullWall}`],
          ['Your uninsured gap', jpy(c.pick(v.price) - v.hullValue)],
        ],
        note: `Far cheaper than folklore suggests — real 2026 direct-insurer quotes on a 2008 R35 came back at ¥38,210–44,700, because 対人 and 対物 are rate class 1, the cheapest possible. But the agreed value is set off market value, not what you paid: about ¥${(v.hullValue / 1e6).toFixed(1)}M here. Write the car off and you personally eat the difference. Anyone under 30 driving pushes the premium to ¥107,000+.`,
      }),
      it('maintenance', `車検 service portion — annualised (${dealer ? 'Nissan dealer' : 'specialist'})`,
        dealer ? c.pick(v.shaken) : c.pick({ low: v.shaken.low * 0.8, base: v.shaken.base * 0.75, high: v.shaken.high * 0.8 }), {
        src: SRC.jpShakenReal, frequencyLabel: 'per year',
        facts: [
          ['GT-R specialist (Tokyo AutoLab)', '¥140,000 per 車検'],
          ['Nissan dealer, itemised invoice', '¥161,843'],
          ['Dealer + warranty-continuation items', '≈¥220,000'],
          ['Independent, full fluids', '¥278,000'],
          ['Worst documented real invoice', '¥930,000'],
          ['Statutory floor (13yr+)', '¥65,260'],
          ['If tyres fall due at inspection', '+¥500,000'],
        ],
        note: 'Biennial, and the right tail is long: real R35 invoices run ¥154,000–462,074, with one documented case at ¥930,000 when deferred wear items all landed at once. Older cars fail on more items, not fewer.',
      }),
      it('maintenance', '消耗品 — 6-monthly inspections, oil, GR6 DCT & diff fluids',
        dealer ? c.pick({ low: 190000, base: 250000, high: 350000 }) : c.pick({ low: 140000, base: 180000, high: 250000 }), {
        src: SRC.nissanTokyo, frequencyLabel: 'per year',
        facts: [
          ['6か月安心点検, R35限定', '¥35,530 (vs ¥13,420)'],
          ['法定12ヶ月点検, R35限定', '¥75,240 (vs ¥27,720)'],
          ['法定24ヶ月点検, R35限定', '¥114,180 (vs ¥44,990)'],
          ['Brake fluid, R35限定', '¥24,640 (vs ¥5,720)'],
          ['Engine oil (Mobil 1 0W-40)', '¥25,000'],
          ['GR6 DCT fluid', '≈¥70,000 per 2 yr'],
          ['Differential oil, each', '≈¥25,000'],
          ['Owner\u2019s itemised total', '¥311,000/yr'],
        ],
        note: 'Nissan Tokyo publishes a dedicated "R35限定" column: the 6-month inspection is ¥35,530 against ¥13,420 for an ordinary car, and brake fluid ¥24,640 against ¥5,720. One owner\'s itemised log totals ¥311,000/yr including tyres.',
      }),
      it('maintenance', 'Failure contingency — GR6, dampers, turbos, parts scarcity', c.pick(v.contingency), {
        src: SRC.gtrParts, est: true, frequencyLabel: 'per year',
        facts: [
          ['GR6 failure cost', '¥1.4M – ¥2.7M'],
          ['Assumed annual probability', v.id === 'early' ? '8% un-remediated' : '≈2%'],
          ['NISMO suspension kit, 2007–09', '¥1,408,000'],
          ['Aftermarket coilovers fitted', '≈¥175,000'],
          ['Turbo set, bolt-on', '¥1,100,000 + engine out'],
          ['Parts for 前期 cars', 'many already discontinued'],
          ['NISMO Heritage', 'covers R32–R34 only, not R35'],
        ],
        note: v.id === 'early'
          ? 'The line that dominates an early car. Expected value of a gearbox failure alone is ¥112,000–216,000/yr un-remediated. Bilstein DampTronic units reach end of life; the genuine NISMO replacement kit for a 2007–2009 car is ¥1,408,000. And a specialist states plainly that many 前期 parts are already discontinued — with no NISMO Heritage programme for the R35, that is a one-way ratchet with no ceiling.'
          : 'Revised gearbox internals and parts still in supply, so this is materially smaller than on an early car — but dampers, bushings and ancillaries still age.',
      }),
      it('energy', `ハイオク — ${Math.round(litres).toLocaleString()} L at ¥${this.rates.fuel}/L`, litres * this.rates.fuel, {
        src: SRC.jpFuel, frequencyLabel: 'per year',
        formula: `${km.toLocaleString()} km ÷ 7.25 km/L × ¥180.90 = ${jpy(litres * this.rates.fuel)}`,
        facts: [
          ['ハイオク national average', '¥180.90/L (2026-09-07)'],
          ['Catalogue WLTC', '7.8 km/L'],
          ['みんカラ, 5,374 refuels', '7.25 km/L — used here'],
          ['e燃費 aggregate', '7.09 km/L'],
          ['Tokyo city', '4–7 km/L'],
          ['Highway', '8–12 km/L'],
          ['Track', 'under 2 km/L'],
          ['Cost per 10,000 km', '¥249,500'],
        ],
        note: '7.25 km/L is the みんカラ average across 5,374 refuelling records. Tokyo city driving is 4–7 km/L; track use is under 2.',
      }),
      it('tyres', `Tyres — ${c.in.tyre === 'oe' ? '255/40R20 + 285/35R20 run-flats' : 'Michelin PS4S'}`, tyreSet / tyreLife * km, {
        src: c.in.tyre === 'oe' ? SRC.gtnetTyre : SRC.gtrTyreAlt, est: true, frequencyLabel: 'per year',
        formula: `${jpy(tyreSet)} per set ÷ ${tyreLife.toLocaleString()} km × ${km.toLocaleString()} km`,
        facts: [
          ['OE Dunlop GT600, 4 tyres', '¥266,200'],
          ['OE fitted (mount, balance, disposal)', '¥299,200'],
          ['OE + TPMS sensors', '¥330,000'],
          ['Michelin PS4S non-run-flat, fitted', '¥195,400'],
          ['Front / rear sizes', '255/40ZR20 / 285/35ZR20'],
          ['Only published life figure', '≈10,000 km — trade opinion'],
          ['Assumed here', tyreLife.toLocaleString() + ' km'],
          ['Non-genuine tyres', 'disqualify NHPC maintenance'],
        ],
        note: `¥${tyreSet.toLocaleString()} fitted, assumed ${tyreLife.toLocaleString()} km life. The only published life figure is trade opinion of ~10,000 km — low confidence. Fitting non-genuine tyres disqualifies the car from Nissan Performance Centre maintenance.`,
      }),
      it('maintenance', 'Brakes — amortised (Brembo steel)', c.pick({ low: 30000, base: 50000, high: 100000 }), {
        src: SRC.gtnetBrake, est: true, frequencyLabel: 'per year',
        facts: [
          ['Pads all round', '≈¥200,000'],
          ['Pads + rotors', '≈¥400,000'],
          ['Genuine front rotor pair', '¥216,000'],
          ['Genuine rear rotor pair', '¥183,600'],
          ['DIXCEL front / rear', '¥194,400 / ¥105,840'],
          ['Replace threshold', '1 mm wear'],
          ['Carbon-ceramic (NCCB)', 'unpriced by Nissan — uncapped'],
        ],
        note: 'Pads ¥200,000, pads + rotors ¥400,000 per job. Carbon-ceramic (NCCB) is unpriced by Nissan and must be serviced only at NHPC — an uncapped liability rather than a line item.',
      }),
      it('parking', '月極駐車場 — central Tokyo', c.pick({ low: 360000, base: 600000, high: 720000 }), {
        src: SRC.jpParkMinato, frequencyLabel: 'per year',
        formula: `${jpy(c.pick({ low: 30000, base: 50000, high: 60000 }))}/month × 12`,
        facts: [
          ['港区 average (630 listings)', '¥47,435/mo'],
          ['港区 平面式 (surface)', '¥55,740/mo'],
          ['港区 機械式', '¥47,230/mo'],
          ['渋谷区 / 新宿区', '¥47,914 / ¥41,462'],
          ['江東区 (豊洲/有明)', '¥30,618/mo'],
          ['Tower mansion own garage', '¥25,000–45,000/mo'],
          ['GT-R width', '1,895 mm — beyond many pallets'],
        ],
        note: '港区 averages ¥47,435/mo, but the GT-R is 1,895 mm wide — beyond many sedan-spec 機械式 pallets, which dominate central Tokyo. Expect 平面式 rates (¥55,740) or a hunt for a shutter garage.',
      }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 4. Tokyo tower mansion                                             */
/* ------------------------------------------------------------------ */
const tower = {
  id: 'tower',
  kind: 'home',
  flag: '🇯🇵',
  name: 'Tower mansion',
  nativeName: 'タワーマンション · 東京',
  place: 'Tokyo, Japan',
  currency: 'JPY',
  accent: '#7dd3fc',
  blurb: 'Move-in costs 4.5–5.5 months\u2019 rent, and only the 敷金 comes back.',
  variants: [
    { id: '1ldk_bay',   label: '1LDK — 豊洲 / 晴海 bayside — ¥250,000',   rent: { low: 200000, base: 250000, high: 300000 }, mgmt: 15000, src: SRC.suumoToyosu },
    { id: '1ldk_minato',label: '1LDK — 港区 / 渋谷区 — ¥290,000',         rent: { low: 250000, base: 290000, high: 340000 }, mgmt: 15000, src: SRC.rehouseTower },
    { id: '2ldk_bay',   label: '2LDK — 豊洲 / 晴海 / 月島 — ¥300,000',    rent: { low: 260000, base: 300000, high: 380000 }, mgmt: 20000, src: SRC.eheyaTsukishima },
    { id: '2ldk_minato',label: '2LDK — 港区 — ¥450,000',                 rent: { low: 380000, base: 450000, high: 520000 }, mgmt: 20000, src: SRC.rehouseTower },
  ],
  defaultVariant: '2ldk_bay',
  inputs: [
    { id: 'household', label: 'Household', type: 'select', def: 'couple',
      options: [{ v: 'single', l: 'One person' }, { v: 'couple', l: 'Two people' }] },
    { id: 'foreigner', label: 'Renting as a foreign resident', type: 'select', def: 'yes',
      options: [{ v: 'yes', l: 'Yes — add guarantor & contact costs' }, { v: 'no', l: 'No' }] },
  ],
  escalation: { low: 0, base: 0.01, high: 0.02 },

  oneTime(c) {
    const rent = c.pick(c.v.rent), mgmt = c.v.mgmt;
    const items = [
      it('fees', '敷金 — 1 month deposit', rent * c.pick({ low: 0, base: 1, high: 2 }), {
        refundable: true, src: SRC.suumoInitial, frequencyLabel: 'one-off, partly refundable',
        facts: [['Greater Tokyo standard', '1 month'], ['Range', '0–2 months'],
                ['Refunded less', '原状回復 (restoration)']], note: 'Partly refundable, less 原状回復 (restoration). Do not treat it as a sunk cost.',
      }),
      it('fees', '礼金 — key money, 1 month', rent * c.pick({ low: 0, base: 1, high: 2 }), {
        src: SRC.suumoInitial, frequencyLabel: 'one-off',
        facts: [['Standard', '1 month'], ['Refundable?', 'No — a gift to the landlord'],
                ['Zero-礼金 stock', 'increasing — worth hunting']], note: 'Pure gift to the landlord. Non-refundable. Zero-礼金 stock is increasing — worth hunting for.',
      }),
      it('fees', '仲介手数料 — agency fee, 1 month + 10% tax', rent * 1.1, {
        src: SRC.suumoInitial, frequencyLabel: 'one-off',
        formula: `${jpy(rent)} × 1.1`,
        facts: [['Statutory ceiling', '1 month + consumption tax'],
                ['Negotiable to', '0.5 month in a slow market']], note: 'One month plus consumption tax is the statutory ceiling. 0.5 months is negotiable in a slow market.',
      }),
      it('fees', '保証会社利用料 — initial (50% of rent + 管理費)', (rent + mgmt) * c.pick({ low: 0.3, base: 0.5, high: 1.0 }), {
        src: SRC.eheyaTsukishima, frequencyLabel: 'one-off',
        formula: `(${jpy(rent)} + ${jpy(mgmt)}) × ${c.pick({ low: 30, base: 50, high: 100 })}%`,
        facts: [['Typical initial fee', '50% of rent + 管理費'], ['Range', '30–100%'],
                ['Real contract, 月島 tower', '50%, min ¥20,000, then ¥9,600/yr'],
                ['Alternative structures', '1.0–1.5% monthly — often dearer overall'],
                ['Mandatory?', 'near-universally, yes']], note: 'Now near-universally mandatory. Compare the LIFETIME cost, not the initial fee — a low initial fee often hides a 1.0–1.5% monthly charge.',
      }),
      it('fees', '鍵交換費用 — lock change', 16500, {
        src: SRC.suumoInitial, frequencyLabel: 'one-off',
        facts: [['Typical', '¥10,000–20,000'], ['Common figure', '¥16,500']] }),
    ];
    if (c.in.foreigner === 'yes') {
      items.push(it('fees', '緊急連絡先代行 — emergency-contact proxy', c.pick({ low: 0, base: 20000, high: 20000 }), {
        src: SRC.gtnGuarantor, est: true, frequencyLabel: 'one-off',
        facts: [['Proxy service', '¥15,000–20,000'],
                ['Contacts normally required', '1–2, Japan-resident'],
                ['GTN accepts', 'overseas-only contacts'],
                ['Not accepted', 'employers or schools as entities'],
                ['Main rejection cause', 'residence card shorter than the lease']],
        note: 'Japanese guarantors are no longer the blocker; guarantor companies have foreigner tracks. The real gate is a residence card whose remaining validity is shorter than the 2-year lease.',
      }));
    }
    return items;
  },
  annual(c) {
    const rent = c.pick(c.v.rent), mgmt = c.v.mgmt;
    const util = c.in.household === 'single'
      ? { low: 13000, base: 16900, high: 22000 }
      : { low: 19000, base: 25400, high: 33400 };
    return [
      it('rent', `家賃 — ¥${rent.toLocaleString()}/month`, rent * 12, {
        escalate: 'rent', src: c.v.src, frequencyLabel: 'per year',
        formula: `${jpy(rent)}/month × 12`,
        facts: [
          ['港区 tower, 1LDK (contracted)', '¥277,299'],
          ['港区 tower, 2LDK', '¥451,625'],
          ['新宿区 tower, 1LDK / 2LDK', '¥278,294 / ¥324,321'],
          ['湾岸 (中央区・江東区), 1LDK / 2LDK', '¥223,772 / ¥290,445'],
          ['豊洲 SUUMO index, 2LDK', '¥322,000'],
          ['グランドシティタワー月島, 2LDK 61㎡', '¥380,000 + ¥20,000'],
          ['Age effect', '1998 build rents at ≈60% of a 2019 one'],
        ],
      }),
      it('fees', `管理費・共益費 — ¥${mgmt.toLocaleString()}/month`, mgmt * 12, {
        src: SRC.sumaiSurfin, frequencyLabel: 'per year',
        formula: `${jpy(mgmt)}/month × 12`,
        facts: [['Tower mansion typical', '¥10,000–30,000/mo'],
                ['Hotel-service buildings', '¥40,000+'],
                ['Observed in listings', '¥10,000 / ¥15,000 / ¥20,000'],
                ['Some listings', '¥0 — rolled into rent']], note: 'Always compare 家賃 + 管理費 together. A ¥370,000 / ¥0 flat beats a ¥360,000 / ¥20,000 one.',
      }),
      it('fees', '更新料 — 1 month every 2 years, annualised', rent * 0.5, {
        src: SRC.jpRenewal, frequencyLabel: 'per year',
        formula: `${jpy(rent)} every 2 years ÷ 2`,
        facts: [['Tokyo properties charging it', '65.0%'],
                ['Of those, exactly 1 month', '66.4%'],
                ['Kanagawa / Chiba', '90.1% / 82.9%'],
                ['Osaka & Hyogo', '0%'],
                ['Consumption tax on it', 'none'],
                ['Legally refusable?', 'No, if it is in the contract']],
        note: '65% of Tokyo properties charge it, and 66.4% of those charge exactly one month. Not statutory, but the Supreme Court has upheld far harsher terms. No consumption tax applies.',
      }),
      it('fees', '保証会社更新料', 9600, {
        src: SRC.eheyaTsukishima, frequencyLabel: 'per year',
        facts: [['Real contract, 月島 tower', '¥9,600/yr'], ['Alternative', '10–30% of rent per 2 yrs']],
        note: 'Verified against a real contract on a Chūō-ku tower.' }),
      it('insurance', '火災保険 — annualised', 10000, {
        src: SRC.suumoInitial, frequencyLabel: 'per year',
        facts: [['Agency-offered, 2 years', '¥15,000–20,000'],
                ['Own insurer, per year', '¥4,000–6,000'],
                ['Can you choose?', 'Yes — proof of cover is all that is required']],
        note: '¥15,000–20,000 per 2 years. You may legally choose your own insurer (¥4,000–6,000/yr available) as long as you show proof.' }),
      it('utilities', `電気・ガス・水道・ネット (${c.in.household === 'single' ? '1 person' : '2 people'})`, c.pick(util) * 12, {
        src: SRC.jpKakei, frequencyLabel: 'per year',
        formula: `${jpy(c.pick(util))}/month × 12`,
        facts: [
          ['家計調査 2025, single: 電気', '¥7,337/mo'],
          ['Single: ガス / 水道', '¥2,999 / ¥2,136'],
          ['Two-person: 電気', '¥12,144/mo'],
          ['Two-person: ガス / 水道', '¥4,663 / ¥4,221'],
          ['光回線 マンション', '¥4,400/mo'],
          ['TEPCO 基本料金 30A', '¥935.25/mo'],
          ['TEPCO 121–300 kWh', '¥36.40/kWh'],
          ['2025 electricity rise', '+8.6% to +11.6%'],
        ],
        note: 'From the 2025 家計調査. Electricity rose 8.6–11.6% in 2025 alone. TEPCO\'s スタンダードS has no fuel-adjustment cap — in the 2023 spike, bills hit 1.4× normal.',
      }),
      it('utilities', 'NHK 受信料 — 衛星契約, 12-month prepaid', 21765, {
        src: SRC.nhkFee, frequencyLabel: 'per year',
        facts: [['衛星契約 monthly', '¥1,950'], ['衛星 12-month prepaid', '¥21,765 — used here'],
                ['地上契約 monthly', '¥1,100'], ['地上 12-month prepaid', '¥12,276'],
                ['Saving by prepaying', '¥1,635/yr'],
                ['Streaming-only, no TV', 'still triggers a contract']],
        note: 'Tower mansions almost always have communal satellite reception, so you get the ¥1,950/mo satellite rate, not the ¥1,100 terrestrial one. Streaming-only use with no TV still triggers a contract.',
      }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 5. Mercedes-AMG — Norway                                           */
/* ------------------------------------------------------------------ */
const amg = {
  id: 'amg',
  kind: 'car',
  flag: '🇳🇴',
  name: 'Mercedes-AMG',
  nativeName: 'C 63 / E 53 · bruktbil · Tromsø',
  place: 'Tromsø, Norway',
  currency: 'NOK',
  accent: '#a78bfa',
  blurb: 'Used, so the big Norwegian car tax is already paid. You owe 1,942–4,532 kr, once.',
  variants: [
    {
      id: 'e53',
      label: 'E 53 (W213) 4MATIC+ — 2019, 83,500 km, 698,900 kr',
      price: { low: 679990, base: 698900, high: 719900 },
      omreg: 4532, drive: 'AWD', power: 457,
      newPriceRef: 1487900, engangsavgiftRef: 344441, co2: 21,
      ins: { low: 17000, base: 22000, high: 30000 }, machineCover: true,
      lPer100: { low: 10.5, base: 12.5, high: 14 },
      service: { low: 6000, base: 8000, high: 12000 },
      contingency: { low: 4000, base: 8000, high: 20000 },
      tyres: { low: 6000, base: 9000, high: 13000 },
      euk: { low: 700, base: 1500, high: 4000 },
      dep: { low: 0.07, base: 0.10, high: 0.14 },
      src: SRC.finnE53Coupe,
      warn: 'Only five E 53s exist in all of Norway, three of them in budget — you take what exists ' +
            'rather than what you would specify. The 48V system is the cold-climate risk: sources flag ' +
            'both heat cycling and connector corrosion, which is exactly what salty coastal air provokes.',
    },
    {
      id: 'c63w205',
      label: 'C 63 S (W205) 4.0 V8 — 2016, 88,500 km, 699,000 kr',
      price: { low: 594532, base: 699000, high: 799900 },
      omreg: 4532, drive: 'RWD', power: 510,
      ins: { low: 18000, base: 24000, high: 32000 }, machineCover: 'marginal',
      lPer100: { low: 13, base: 15, high: 17 },
      service: { low: 7000, base: 10000, high: 15000 },
      contingency: { low: 6000, base: 18000, high: 32000 },
      tyres: { low: 8000, base: 13000, high: 19000 },
      euk: { low: 700, base: 1800, high: 5000 },
      dep: { low: 0.05, base: 0.08, high: 0.12 },
      src: SRC.finnC63Estate,
      warn: 'Rear-wheel drive and 510 hp, in a hilly island city with 197 statutory winter days. ' +
            'Also verify the third service actually happened — plugs, ATF and diff oil are routinely ' +
            'deferred by previous owners, and the catch-up is on you.',
    },
    {
      id: 'c63w204',
      label: 'C 63 (W204) 6.2 V8 — 2013, 112,000 km, 640,000 kr',
      price: { low: 419900, base: 640000, high: 660000 },
      omreg: 1942, drive: 'RWD', power: 457,
      ins: { low: 14000, base: 18000, high: 24000 }, machineCover: false,
      lPer100: { low: 15, base: 17, high: 19 },
      service: { low: 6000, base: 9000, high: 13000 },
      contingency: { low: 8000, base: 26000, high: 45000 },
      tyres: { low: 7000, base: 11000, high: 16000 },
      euk: { low: 700, base: 2200, high: 6000 },
      dep: { low: -0.02, base: 0.02, high: 0.06 },
      src: SRC.finnC63,
      warn: 'The last naturally aspirated AMG V8, and the cheapest of these to own — near-zero ' +
            'depreciation pays for its thirst. But no Norwegian insurer writes machine-damage cover on ' +
            'a 13-year-old car, so the M156 head-bolt and camshaft risk is entirely yours.',
    },
    {
      id: 'c43',
      label: 'C 43 (W205) V6 4MATIC — 2018, 25,000 km, 619,000 kr',
      price: { low: 399900, base: 619000, high: 649500 },
      omreg: 4532, drive: 'AWD', power: 367,
      ins: { low: 12000, base: 16000, high: 22000 }, machineCover: true,
      lPer100: { low: 10, base: 11.5, high: 13 },
      service: { low: 5000, base: 7000, high: 10000 },
      contingency: { low: 3000, base: 7000, high: 15000 },
      tyres: { low: 6000, base: 9000, high: 12000 },
      euk: { low: 700, base: 1500, high: 4000 },
      dep: { low: 0.06, base: 0.09, high: 0.13 },
      src: SRC.finnC43,
      warn: 'The sensible one: 4MATIC, ~3,000 km/year of prior use, and none of the three signature ' +
            'failure modes — no M156 head bolts, no M177 oil separator, no 48V system. It is slower ' +
            'and it does not sound like a C 63. That is the whole trade.',
    },
    {
      id: 'e63w212',
      label: 'E 63 S (W212) 5.5 V8 4MATIC — 2015, 95,000 km, 699,990 kr',
      price: { low: 509990, base: 699990, high: 699990 },
      omreg: 4532, drive: 'AWD', power: 585,
      ins: { low: 19000, base: 25000, high: 34000 }, machineCover: 'marginal',
      lPer100: { low: 13, base: 15.5, high: 18 },
      service: { low: 7000, base: 10000, high: 15000 },
      contingency: { low: 7000, base: 18000, high: 35000 },
      tyres: { low: 7000, base: 11000, high: 16000 },
      euk: { low: 700, base: 2000, high: 5000 },
      dep: { low: 0.05, base: 0.08, high: 0.12 },
      src: SRC.finnE63,
      warn: 'The dark horse: all-wheel drive, a V8, and a 24-month franchised-dealer warranty — the ' +
            'longest cover found anywhere in this survey. M157, not M156, so no head-bolt issue. ' +
            'Check førstegangsregistrering: a 2014-registered car pays only 1,942 kr to transfer.',
    },
  ],
  defaultVariant: 'e53',
  inputs: [
    { id: 'km',    label: 'Distance driven', unit: 'km/year', type: 'range', min: 3000, max: 30000, step: 1000, def: 6000 },
    { id: 'tolls', label: 'Toll passages', unit: 'paid/month', type: 'range', min: 0, max: 80, step: 5, def: 10,
      hint: '15 stations ring the island. Capped at 80 a month.' },
    { id: 'heater', label: 'Block heater (motorvarmer)', type: 'select', def: 'yes',
      options: [{ v: 'yes', l: 'Fitted — DEFA WarmUp II, ~12,500 kr' }, { v: 'no', l: 'Not fitted — pay ~9% more for fuel' }] },
    { id: 'parking', label: 'Secure covered parking', type: 'select', def: 'none',
      options: [{ v: 'none', l: 'Park outside — free, and it rusts' }, { v: 'beboer', l: 'Beboerkort — 917 kr/mo' }, { v: 'seminaret', l: 'Seminaret P-kort — 1,796 kr/mo' }, { v: 'fjellet', l: 'Fjellet årskort — 26,000 kr/yr' }] },
  ],
  rates: { petrol: { low: 25, base: 27, high: 30 }, toll: 11.20, tollRush: 33.60 },

  oneTime(c) {
    const v = c.v;
    const items = [
      it('capital', 'Used purchase price (finn.no)', c.pick(v.price), {
        src: v.src, frequencyLabel: 'one-off',
        facts: [
          ['C 63 listings on FINN', '61 cars'],
          ['E 53 listings on FINN', 'only 5 in all of Norway'],
          ['2016 C 63 S estate, 88,500 km', '699,000 kr, 7 service stamps'],
          ['2019 E 53 coupé, 83,500 km', '698,900 kr, full BOS history'],
          ['2020 E 53 estate, 158,000 km', '679,990 kr'],
          ['2013 C 63 W204, 112,000 km', '639,999 kr'],
          ['2018 C 43, 25,000 km', '619,000 kr'],
          ['2015 E 63 S W212, 95,000 km', '699,990 kr, 24-mo warranty'],
          ['New E 53 estate for comparison', '1,487,900 kr'],
        ],
      }),
      it('tax', `Omregistreringsavgift (reg. ${v.omreg === 1942 ? '2014 or older' : '2015–2022'}, >1,200 kg)`, v.omreg, {
        src: SRC.lovdataOmreg, frequencyLabel: 'one-off',
        facts: [
          ['Reg. 2026–2023, >1,200 kg', '7,505 kr'],
          ['Reg. 2022–2015, >1,200 kg', '4,532 kr'],
          ['Reg. 2014 and older, any weight', '1,942 kr'],
          ['Weight used', 'typegodkjent egenvekt, not actual'],
          ['Rate set by', 'status at the moment of transfer'],
        ],
        note: 'The whole tax bill. A 2014-or-older car pays a flat 1,942 kr regardless of weight; 2015–2022 pays 4,532 kr. Watch the edge case — a late W204 first registered in 2015 jumps to the higher band, so check førstegangsregistrering rather than model year.',
      }),
      it('tax', 'Engangsavgift', 0, {
        src: SRC.skattUsedCar, frequencyLabel: 'one-off',
        facts: [
          ['On a used Norwegian-registered car', '0 kr — already paid'],
          ['Grunnavgift vekt', '12.71 kr/kg above 500 kg'],
          ['Vektkomponent, combustion', '260 kr/kg above 1,200 kg'],
          ['CO₂ brackets', '800 / 1,600 / 3,200 / 5,000 kr per g'],
          ['NOx component', 'removed 2026-01-01'],
          ['PHEV weight deduction', 'removed 2024-01-01'],
          ['E 53 if bought new', '≈344,441 kr'],
          ['C 63 S E Perf. if newly registered', '≈460,480 kr'],
        ],
        note: v.engangsavgiftRef
          ? `Zero, because it was paid once at first registration and is never re-levied. On this model bought NEW it would be about ${v.engangsavgiftRef.toLocaleString()} kr inside a ${v.newPriceRef.toLocaleString()} kr list price — which is the single reason a used performance car is such better value in Norway.`
          : 'Zero. Skatteetaten: on a car previously registered in Norway, "engangsavgiften og merverdiavgiften er allerede betalt". The one exception is a bruktimport never registered here, which attracts the full tax on import.',
      }),
      it('tax', 'MVA (25% VAT)', 0, {
        src: SRC.skattUsedCar, frequencyLabel: 'one-off',
        facts: [['Used, already registered here', '0 kr'],
                ['New ICE / hybrid', '25%, no threshold'],
                ['EV, from 2026', 'exempt on first 300,000 kr'],
                ['Bruktimport never registered here', 'full MVA on import']],
        note: 'Not re-levied on a used car already registered in Norway. Omregistreringsavgift replaces VAT on used sales between private parties.',
      }),
      it('maintenance', 'Pre-purchase inspection', c.pick({ low: 2000, base: 5000, high: 8000 }), {
        src: SRC.m156Bolts, est: true, frequencyLabel: 'one-off',
        facts: [['NAF Test Eierskifte', 'from 1,950 kr'], ['Viking Kontroll', 'from 1,550 kr'],
                ['NAF caveat', '"demonterer ikke for kontroll"'],
                ['Specialist, valve covers off', '4,000–8,000 kr'],
                ['M156 safe engine serial', 'above 60-060658']],
        note: v.id === 'c63w204'
          ? 'Do not skip this, and do not rely on NAF: they explicitly "demonterer ikke for kontroll", so their report cannot find either M156 problem. Pay a specialist to pull the valve covers, inspect the cam lobes, and read the engine serial off the white sticker on the left cover — above 60-060658 you are safe from the head-bolt flaw.'
          : 'NAF Test Eierskifte starts around 1,950 kr and Viking Kontroll 1,550, but neither dismantles anything. Budget for a specialist look at the known failure points for this engine.',
      }),
      it('fees', 'Travel to view and collect', c.pick({ low: 8000, base: 14000, high: 20000 }), {
        est: true, frequencyLabel: 'one-off', src: SRC.finnC63,
        facts: [['Cars in band located', 'almost all in Southern/Western Norway'],
                ['Nearest to Tromsø found', 'a W204 in Sortland (Nordland)'],
                ['Drive home', '1,500+ km']],
        note: 'Almost every car in this band is in Southern or Western Norway. Expect flights plus transport, or a 1,500 km drive home.',
      }),
      it('tyres', 'Winter tyre set', c.pick({ low: 11320, base: 14000, high: 16000 }), {
        src: SRC.prisradarWinter, frequencyLabel: 'one-off',
        facts: [
          ['W204 set (235/40R18 + 255/35R18)', '11,320–12,860 kr'],
          ['W205 set (245/35R19 + 265/30R19)', '≈15,130 kr'],
          ['Michelin X-Ice Snow 235/40R18', '2,930 kr each'],
          ['Pirelli P Zero Winter 265/30R19', '4,194 kr each'],
          ['Legal minimum tread, Troms', '3 mm, 16 Oct – 30 Apr'],
          ['NAF recommend', '4 mm'],
          ['Norwegian speed-rating rule', 'minimum Q (160 km/h)'],
          ['Winter season length', '197 days — 54% of the year'],
        ],
        note: 'Not optional: from 16 October to 30 April in Troms the legal minimum tread is 3 mm (NAF recommend 4), and winter tyres must be speed-rated Q or better — a Norwegian-specific rule. That is 197 days, 54% of the year. Studs are legal in the same window and must be on all four wheels.',
      }),
      it('maintenance', 'Underbody rustproofing (initial, 2–3 day job)', c.pick({ low: 12000, base: 16000, high: 20000 }), {
        src: SRC.rustBodo, est: true, frequencyLabel: 'one-off',
        facts: [['Proper job takes', '2–3 days'], ['Re-treat within', '36 months'],
                ['Best timing', 'spring or summer, never winter'],
                ['Coastal products needed', 'Mercasol or Tectyl'],
                ['Underbody wash in salt season', 'every 1–2 weeks'],
                ['Covered by warranty?', 'No — salt damage counts as wear']],
        note: 'Coastal Northern Norway combines heavy road salt with high humidity, and Norwegian specialists are blunt that most cars "er utviklet og produsert for bruk under andre klimatiske forhold enn vårt". Salt damage is classified as wear and no warranty covers it. Get the dealer\'s written approval first — an unauthorised treatment can void the factory rust warranty.',
      }),
    ];
    if (c.in.heater === 'yes') {
      items.push(it('maintenance', 'Block heater — DEFA WarmUp II, fitted', c.pick({ low: 10000, base: 12500, high: 15000 }), {
        src: SRC.defaHeater, frequencyLabel: 'one-off',
        facts: [['DEFA WarmUp II 1900 package', '7,450 kr'],
                ['Heater element', 'model-specific, sold separately'],
                ['Fitting', 'authorised workshop only'],
                ['Cold engine uses', '≈30% more fuel (NAF)'],
                ['Emissions cut', 'up to 71% over the first km'],
                ['Payback', '2–3 years on fuel alone']],
        note: 'Pays for itself in two to three years on fuel alone: NAF measure a cold engine using about 30% more fuel over the first kilometres. It also reduces exactly the cold-start wear that eats M156 camshafts. Note the heater element is model-specific and sold separately, and fitting must be done by an authorised workshop.',
      }));
    }
    return items;
  },
  annual(c) {
    const v = c.v, km = c.in.km;
    const petrolPrice = c.pick(this.rates.petrol);
    const coldPenalty = c.in.heater === 'yes' ? 1 : 1.09;
    const petrolL = km * c.pick(v.lPer100) / 100 * coldPenalty;
    const parkingRates = { none: 0, beboer: 917 * 12, seminaret: 1796 * 12, fjellet: 26000 };
    return [
      it('tax', 'Trafikkforsikringsavgift', 2380, {
        src: SRC.skattTfa, frequencyLabel: 'per year',
        formula: '6.52 kr/day × 365',
        facts: [['Petrol car, from 2026-03-01', '6.52 kr/day = 2,380 kr/yr'],
                ['Diesel without factory DPF', '8.10 kr/day = 2,957 kr'],
                ['Electric car', '9.16 kr/day = 3,343 kr'],
                ['Collected by', 'your insurer, with the liability premium']],
        note: '6.52 kr/day for a petrol car, collected through your insurer. Quirk worth savouring: EVs pay 9.16 kr/day (3,343/yr), so your AMG is cheaper than a Tesla on this one line. It is billed for every day the car is insured — parking it all week does not stop the meter.',
      }),
      it('insurance', `Bilforsikring (kasko)${v.machineCover === false ? ' — no machine-damage cover' : v.machineCover === 'marginal' ? ' — machine cover expiring' : ''}`, c.pick(v.ins), {
        src: SRC.noMachineCover, est: true, frequencyLabel: 'per year',
        facts: [
          ['Norwegian average premium 2026', '10,300 kr'],
          ['Premium inflation, 12 months', '+16.6%'],
          ['Standard collision deductible', '8,000 kr'],
          ['Machine cover, Gjensidige / Storebrand', 'to 12 yrs or 200,000 km'],
          ['Machine cover, Tryg / Fremtind', 'to 10 yrs or 200,000 km'],
          ['This car', v.machineCover === false ? 'too old — no machine cover' : v.machineCover === 'marginal' ? '1–2 years of cover left' : 'machine cover available'],
          ['Veteranforsikring', 'needs 30+ yrs — not an option'],
        ],
        note: `The weakest number in this whole model. No Norwegian insurer publishes AMG premiums — all of them need a registration number and BankID first — so this is scaled from the 10,300 kr national average, which itself rose 16.6% in a year. ${
          v.machineCover === false
            ? 'And at 13 years old, machine-damage cover is unavailable at every insurer surveyed: Gjensidige and Storebrand cap it at 12 years, Tryg and Fremtind at 10. A blown engine is 100% your problem.'
            : v.machineCover === 'marginal'
            ? 'At 10 years old this car has one to two years of machine-damage cover left, at best.'
            : 'Machine-damage cover is still available via Gjensidige or Storebrand, up to 12 years or 200,000 km.'
        } Get real quotes on the actual registration number before you make an offer.`,
      }),
      it('energy', `Petrol 98 — ${Math.round(petrolL).toLocaleString()} L at ${petrolPrice} kr/L${coldPenalty > 1 ? ' (+9% cold-start)' : ''}`, petrolL * petrolPrice, {
        src: SRC.dinsideFuel, frequencyLabel: 'per year',
        formula: `${km.toLocaleString()} km × ${c.pick(v.lPer100)} l/100km${coldPenalty > 1 ? ' × 1.09 cold-start' : ''} × ${petrolPrice} kr = ${nok(petrolL * petrolPrice)}`,
        facts: [
          ['Duty cut expired', '2026-09-01, +4.41 kr/L'],
          ['National median, 1 Sep', '26.84 kr/L'],
          ['Tromsø 95-octane after the change', '≈27.50 kr/L'],
          ['M156 6.2 V8, 184 users', '17.0 l/100km'],
          ['M177 4.0 V8, owner reports', '13–15 l/100km'],
          ['M256 E 53, 96 users', '12.5 l/100km'],
          ['C 43 V6, owner report', '11.5 l/100km'],
          ['City-only M156', '17–24 l/100km'],
        ],
        note: `${c.pick(v.lPer100)} l/100km is real-world owner data, not the type-approval figure. The temporary fuel duty cut expired at midnight on 2026-09-01, adding about 4.41 kr/L — Tromsø petrol went from just over 20 kr to around 27.50 kr overnight. If your driving is mostly short urban trips in the cold, use the pessimistic scenario as your base: city-only M156 owners report 17–24 l/100km.`,
      }),
      it('tolls', `Bomring Tromsø — ${c.in.tolls} paid passages/month`, Math.min(c.in.tolls, 80) * this.rates.toll * 12, {
        src: SRC.bpsNord, frequencyLabel: 'per year',
        formula: `${Math.min(c.in.tolls, 80)} passages × 11.20 kr × 12 months`,
        facts: [
          ['Off-peak with AutoPASS', '11.20 kr'],
          ['Off-peak without a tag', '14.00 kr'],
          ['Rush hour with tag', '33.60 kr'],
          ['Rush hour without', '42.00 kr'],
          ['Rush hours', 'Mon–Fri 06:30–09:00, 15:00–17:00'],
          ['Monthly cap', '80 paid passages'],
          ['Hourly rule', 'one charge per 60 min across 15 stations'],
          ['PHEV rate', 'same as petrol — no discount'],
        ],
        note: '11.20 kr off-peak with AutoPASS, 33.60 kr in rush hour (Mon–Fri 06:30–09:00 and 15:00–17:00). Capped at 80 paid passages a month, with one charge per 60 minutes across all 15 stations.',
      }),
      it('maintenance', 'Mercedes service (A/B alternating)', c.pick(v.service), {
        src: SRC.mbAmgOnRequest, est: true, frequencyLabel: 'per year',
        facts: [
          ['Published A-service, C/E-Class', '5,990 kr'],
          ['Published B-service', '6,990 kr'],
          ['Brake fluid', '1,690 kr'],
          ['AMG models', '"pris på forespørsel" — unpublished'],
          ['Merkeverksted labour', '1,000–1,300 kr/h ex-MVA'],
          ['Independent workshop', '700–1,000 kr/h'],
          ['Service interval', '1 year or 25,000 km'],
        ],
        note: 'Mercedes Norway publishes a fixed price for every model group except AMG, S-Class and G-Class — those are "pris på forespørsel", so you cannot look this up. Derived by uplifting the published C-Class figures (A-service 5,990, B-service 6,990). An independent workshop saves 25–35% on labour.',
      }),
      it('maintenance', 'Failure contingency for this engine', c.pick(v.contingency), {
        src: v.id === 'c63w204' ? SRC.m156Check : v.id === 'c63w205' ? SRC.m177Check : SRC.e53_48v, est: true,
        frequencyLabel: 'per year',
        facts: v.id === 'c63w204' ? [
          ['Head bolts, preventive', '35,000–59,000 kr'],
          ['Head bolts, after damage', '71,000–94,000+ kr'],
          ['Affected engine serials', 'below 60-060658'],
          ['Recall issued?', 'No — a bulletin only'],
          ['Cams + lifters, one bank', '18,000–30,000 kr'],
          ['Cams + lifters, both banks', '30,000–59,000 kr'],
          ['Cam wear appears at', '≈160,000 km'],
          ['Workshop time for cams', 'under 20 hours'],
        ] : v.id === 'c63w205' ? [
          ['Oil separator + rear main seal', '24,000–53,000 kr'],
          ['Requires', 'transmission removal'],
          ['Appears at', '60,000–100,000 km'],
          ['All 8 ignition coils + plugs', '4,700–11,800 kr'],
          ['Coil part numbers issued', 'three different ones'],
          ['Transmission service', '6,300–10,500 kr'],
          ['Tuned cars', 'walk away — Stage 2/3 report issues'],
        ] : v.id === 'e53' ? [
          ['48V ISG / DC-DC failure', '12,600–47,250 kr'],
          ['Physical ISG replacement', '26,250–52,500 kr'],
          ['Fuel pump delivery module', '9,450–18,900 kr'],
          ['Mercedes TSB', 'LI15.30-P-078376 — software fix'],
          ['Fault codes', 'P0A44B2 / P0AFB00'],
          ['48V attention window', '130,000–190,000 km'],
          ['Cold-climate risk', 'connector corrosion'],
        ] : [
          ['M156 head bolts', 'not applicable'],
          ['M177 oil separator', 'not applicable'],
          ['48V system', 'none fitted'],
        ],
        note: v.id === 'c63w204'
          ? 'Two known time bombs. Head bolts, on engines below serial 60-060658, are 35,000–59,000 kr preventive or 71,000–94,000+ kr once coolant has entered the cylinders — and there was never a recall, only a bulletin. Camshaft and lifter wear is the MORE likely of the two: FCP Euro treat camshaft replacement as routine maintenance around 160,000 km, at 30,000–59,000 kr for both banks. Halve this line if both are documented as done.'
          : v.id === 'c63w205'
          ? 'The signature M177 failure is a clogged oil separator raising crankcase pressure until oil forces past the rear main seal — 24,000–53,000 kr, because the transmission has to come out, and it typically appears at 60,000–100,000 km. Fixing only the seal means the leak returns. Also budget all eight ignition coils; Mercedes has issued three different part numbers for them, which tells you something.'
          : v.id === 'e53'
          ? 'The 48V ISG and DC-DC converter are the risk: sudden power loss or a no-restart, at 12,600–47,250 kr. The good news is that Mercedes TSB LI15.30-P-078376 fixes the common version in SOFTWARE (fault codes P0A44B2 and P0AFB00) — verify it has been applied. The bad news is that sources put 48V "attention" at 130,000–190,000 km, so raise this line sharply on a high-mileage car.'
          : 'No M156 head bolts, no M177 oil separator, no 48V hardware. This is the low-variance choice.',
      }),
      it('tyres', 'Tyres — amortised (summer + winter sets)', c.pick(v.tyres), {
        src: SRC.prisradarWinter, est: true, frequencyLabel: 'per year',
        facts: [['Winter set life assumed', '4 seasons'],
                ['Rear summer tyres, RWD AMG', 'gone in 6,700–8,000 km'],
                ['Owner verdict', '"think more about tyre wear than fuel"'],
                ['This car', v.drive === 'RWD' ? 'RWD — rear tyres take everything' : 'AWD — wear spread over 4 wheels']],
        note: v.drive === 'RWD'
          ? 'Higher than you would guess on a rear-drive AMG. Owners report rear summer tyres consumed in 6,700–8,000 km — one put it as "you should think more about tyre wear than fuel consumption".'
          : 'All-wheel drive spreads wear across four driven wheels, which materially cuts the bill versus a rear-drive AMG.',
      }),
      it('tyres', 'Hjulskifte × 2 + dekkhotell', 2300, {
        src: SRC.vinterdekk, frequencyLabel: 'per year',
        facts: [['Wheel swap, each', '500–1,000 kr'],
                ['Two swaps a year', '1,000–2,000 kr'],
                ['Dekkhotell per season', '500–1,200 kr'],
                ['Studded tyres legal', '16 Oct – 30 Apr, all four wheels']] }),
      it('maintenance', 'Rustproofing — re-treatment amortised', c.pick({ low: 3000, base: 5000, high: 7000 }), {
        src: SRC.dinitrolSalt, est: true, frequencyLabel: 'per year',
        facts: [['Re-treatment interval', '2–3 years, within 36 months'],
                ['Salt damage under warranty?', 'never — classed as wear'],
                ['Mercedes rust warranty, E 53 era', '30 years — do not void it']],
        note: 'Re-treat within 36 months to keep the guarantee, in spring or summer after the salt is washed off. Also wash the underbody every one to two weeks through the salt season.',
      }),
      it('fees', 'EU-kontroll — annualised, including remedial work', c.pick(v.euk), {
        src: SRC.svEuFail, frequencyLabel: 'per year',
        facts: [
          ['Test itself', '800–1,500 kr, typically 1,300'],
          ['Re-test (etterkontroll)', '150–500 kr'],
          ['Interval', 'first at 4 yrs, then every 2 — for life'],
          ['National fail rate 2025', '47% of light vehicles'],
          ['10-yr petrol cars failing on suspension', '16%'],
          ['Vehicles given bruksforbud in 2025', '≈33,000'],
          ['Price regulated?', 'No'],
        ],
        note: 'Every passenger car is on a two-year cycle for life — there is no age-based change, contrary to common belief. But 47% of Norwegian light vehicles failed in 2025, and 16% of ten-year-old petrol cars failed on axles, wheels, tyres and suspension alone, so this line includes a failure allowance. Watch for the EU proposal to move over-ten-year-old cars to annual testing.',
      }),
      it('parking', c.in.parking === 'none' ? 'Parking — outside' : `Parking — ${c.in.parking === 'fjellet' ? 'Fjellet p-hus årskort' : c.in.parking === 'seminaret' ? 'Seminaret P-kort' : 'beboerkort'}`, parkingRates[c.in.parking], {
        src: SRC.tromsoParking, frequencyLabel: 'per year',
        facts: [['Fjellet årskort', '26,000 kr/yr — SOLD OUT, waiting list'],
                ['Seminaret P-kort', '1,796 kr/mo = 21,552 kr/yr'],
                ['Beboerkort', '917 kr/mo = 11,004 kr/yr'],
                ['Street parking', '42 kr/h'],
                ['Fjellet height limit', '2.20 m'],
                ['Heated?', 'no source confirms any Tromsø garage is']],
        note: 'The Fjellet årskort is blasted into rock under the city centre, which shelters the car from frost, wind and salt spray — but it is currently sold out with a waiting list, so apply early. No source confirms any Tromsø public garage is actually heated. Height limit 2.20 m, fine for all of these.',
      }),
      it('tax', 'Piggdekkgebyr (studded tyre fee)', 0, {
        src: SRC.tromsoTax, frequencyLabel: 'per year',
        facts: [['Tromsø today', '0 kr — proposed, never adopted'],
                ['Potential revenue cited', '39 million kr'],
                ['Oslo / Bergen / Trondheim / Stavanger', '1,400 kr/season'],
                ['Daily rate in those cities', '35 kr, penalty 750 kr']],
        note: 'Tromsø has repeatedly proposed one and never adopted it — local reporting puts the potential revenue at 39M kr. Budget zero today, but Oslo, Bergen, Trondheim and Stavanger all charge about 1,400/season.',
      }),
    ];
  },
};

/* ------------------------------------------------------------------ */
/* 6. Northern Norway house                                           */
/* ------------------------------------------------------------------ */
const arctic = {
  id: 'arctic',
  kind: 'home',
  flag: '🇳🇴',
  name: 'Arctic house',
  nativeName: 'Tromsø / Lofoten',
  place: 'Northern Norway',
  currency: 'NOK',
  accent: '#38bdf8',
  blurb: 'Real listings for a house are 22,000–36,000 kr. In Lofoten many leases end on 31 May.',
  variants: [
    { id: 'tromso_house', label: 'Tromsø — small house, 3 bed — 23,000 kr', rent: { low: 22000, base: 23000, high: 36000 }, kwh: { low: 18000, base: 20000, high: 22000 }, seasonal: false, src: SRC.finnHamna },
    { id: 'tromso_apt',   label: 'Tromsø — 2–3 room apartment — 14,000 kr', rent: { low: 12000, base: 14000, high: 16000 }, kwh: { low: 9000, base: 11000, high: 13000 }, seasonal: false, src: SRC.ssbLmu },
    { id: 'svolvaer',     label: 'Svolvær (Lofoten) — furnished 2 bed — 21,000 kr', rent: { low: 19000, base: 21000, high: 24000 }, kwh: { low: 11000, base: 14000, high: 17000 }, seasonal: true, src: SRC.finnSvolvaer },
    { id: 'vestvagoy',    label: 'Leknes / Bøstad (Lofoten) — house — 15,000 kr', rent: { low: 14000, base: 15000, high: 18000 }, kwh: { low: 16000, base: 19000, high: 22000 }, seasonal: true, src: SRC.hybelLeknes },
  ],
  defaultVariant: 'tromso_house',
  inputs: [
    { id: 'power', label: 'Electricity contract', type: 'select', def: 'norgespris',
      options: [{ v: 'norgespris', l: 'Norgespris — 40 øre/kWh fixed' }, { v: 'spot', l: 'NO4 spot + strømstøtte' }] },
    { id: 'transit', label: 'Add a Svipper transit pass', type: 'select', def: 'no',
      options: [{ v: 'no', l: 'No' }, { v: 'yes', l: 'Yes — 562 kr/month' }] },
  ],
  escalation: { low: 0.01, base: 0.03, high: 0.05 },

  oneTime(c) {
    const rent = c.pick(c.v.rent);
    const months = c.pick({ low: 2, base: 3, high: 6 });
    return [
      it('fees', `Depositum — ${months} months' rent`, rent * months, {
        refundable: true, src: SRC.husleieloven, frequencyLabel: 'one-off, refundable',
        formula: `${nok(rent)}/month × ${months} months`,
        facts: [
          ['Legal maximum', 'SIX months (husleieloven § 3-5)'],
          ['Market convention', '2–3 months'],
          ['Tromsdalen listing, 22,000 rent', '50,000 kr deposit'],
          ['Kræmervegen, 35,000 rent', '70,000 kr'],
          ['Leknes, 15,000 rent', '45,000 kr'],
          ['Account', 'blocked, in YOUR name'],
          ['Who pays setup', 'the landlord'],
          ['Who keeps the interest', 'you'],
          ['Max rent in advance', '1 month'],
        ],
        note: 'The legal maximum is SIX months, not three (husleieloven § 3-5). It must sit in a blocked account in YOUR name, the landlord pays the setup cost, and you keep the interest. Paying it into the landlord\'s own account is illegal and fully recoverable with default interest.',
      }),
      it('fees', 'Alternative: depositumsgaranti (15% fee instead of cash)', 0, {
        informational: true, src: SRC.hybelLeknes, frequencyLabel: 'alternative',
        facts: [['Tryg guarantee fee', '15% of the deposit'],
                ['On this deposit', nok(rent * months * 0.15)],
                ['Cash you keep free', nok(rent * months)],
                ['Refundable?', 'No — it is a fee, not an asset']],
        note: `Tryg's guarantee costs 15% of the deposit — about ${Math.round(rent * months * 0.15).toLocaleString()} kr here — instead of tying up ${Math.round(rent * months).toLocaleString()} kr. It is a fee, not a refundable asset.`,
      }),
    ];
  },
  annual(c) {
    const rent = c.pick(c.v.rent);
    const kwh = c.pick(c.v.kwh);
    // Norgespris 0.40 + supplier påslag 0.05 + Arva energiledd ~0.18 + elavgift 0.0713, no VAT in Troms.
    const varRate = c.in.power === 'norgespris' ? 0.70 : 0.68;
    const fastledd = c.pick({ low: 2412, base: 4776, high: 7140 });
    const items = [
      it('rent', `Rent — ${rent.toLocaleString()} kr/month`, rent * 12, {
        escalate: 'rent', src: c.v.src, frequencyLabel: 'per year',
        formula: `${nok(rent)}/month × 12`,
        facts: [
          ['SSB, 3-room, settlements 20k+', '11,840 kr — understates a house'],
          ['SSB publishes Tromsø?', 'No — it is not its own zone'],
          ['Tromsdalen, 110 m², 2 bed', '22,000 kr'],
          ['Hamna, detached, 3 bed', '22,500 kr'],
          ['Senjavegen, 116 m², 3 bed', '24,000 kr'],
          ['Kræmervegen villa, 235 m²', '35,000 kr'],
          ['Sørems Veg rekkehus, 130 m²', '36,000 kr'],
          ['Svolvær, furnished 2 bed', '21,000 kr'],
          ['Leknes house, 175 m²', '15,000 kr'],
          ['Henningsvær', 'rooms in shared houses only'],
        ],
      }),
      it('utilities', `Strøm — ${kwh.toLocaleString()} kWh/yr at ${varRate.toFixed(2)} kr/kWh`, kwh * varRate, {
        src: SRC.elspot, frequencyLabel: 'per year',
        formula: `${kwh.toLocaleString()} kWh × ${varRate.toFixed(2)} kr = ${nok(kwh * varRate)}`,
        facts: [
          ['Price area', 'NO4 — Norway\u2019s cheapest'],
          ['NO4 spot average 2026', '38.95 øre/kWh'],
          ['NO1 / NO2 for comparison', '115.52 / 118.01 øre'],
          ['Norgespris in NO4', '40 øre/kWh, expires 2026-12-31'],
          ['Strømstøtte trigger', '90% of spot above 77 øre'],
          ['Supplier påslag', '≈5 øre'],
          ['Arva energiledd, low/high load', '11.60 / 23.10 øre'],
          ['Elavgift', '7.13 øre — Tromsø pays it'],
          ['MVA on electricity in Troms', '0% — exempt'],
          ['Detached house, national average', '19,676 kWh/yr'],
          ['Troms per capita vs national', '+35%'],
          ['Winter month bill', '2,500–3,000 kr'],
          ['Summer month bill', '800–1,000 kr'],
        ],
        note: 'Heating dominates. NO4 spot averaged 38.95 øre/kWh in 2026 versus 115–118 in the south, and Nordland/Troms/Finnmark pay no VAT on electricity — but Tromsø kommune is NOT in the tiltakssonen, so it does pay the 7.13 øre elavgift. Winter months run 2,500–3,000 kr; summer 800–1,000.',
      }),
      it('utilities', 'Nettleie fastledd (capacity-based, Arva)', fastledd, {
        src: SRC.arva, frequencyLabel: 'per year',
        facts: [
          ['0–2 kW', '1,020 kr/yr'],
          ['2–5 kW', '2,412 kr/yr'],
          ['5–10 kW', '4,776 kr/yr — used here'],
          ['10–15 kW', '7,140 kr/yr'],
          ['15–20 kW', '9,504 kr/yr'],
          ['Set by', 'your three highest daily peaks each month'],
          ['2026 tariff', 'frozen — but Arva warns of a 2027 rise'],
        ],
        note: 'Set by your three highest daily peaks each month. Arva froze 2026 tariffs but has explicitly warned they rise in 2027 on Statnett transmission costs.',
      }),
      it('utilities', 'Internet', c.pick({ low: 0, base: 6000, high: 8400 }), {
        est: true, frequencyLabel: 'per year', src: SRC.finnHamna,
        facts: [['Assumed', '500–700 kr/month'],
                ['Tønsnesvegen & Senjavegen listings', 'internet included in rent'],
                ['Confidence', 'low — no Norwegian price list found']],
        note: 'Several Tromsø listings include internet in the rent — worth 400–700 kr/month of implied value. Check before adding it.' }),
      it('fees', 'Kommunale avgifter & eiendomsskatt', 0, {
        src: SRC.husleieloven, frequencyLabel: 'per year',
        facts: [
          ['Who pays', 'the landlord — priced into your rent'],
          ['Tenant may be billed only for', 'electricity/fuel and METERED water'],
          ['Eiendomsskatt, Tromsø', '4 promille of assessed value'],
          ['Bunnfradrag', 'cut to a token 10 kr in April 2026'],
          ['Kommunale avgifter, standard household', '≈16,280 kr/yr incl. MVA'],
          ['Billed', '4 instalments: 1 Mar, Jun, Sep, Dec'],
        ],
        note: 'The landlord\'s problem, already priced into your rent. Husleieloven § 3-1 permits only electricity/fuel and METERED water/sewage as add-ons — property tax, refuse and chimney sweeping cannot be separately invoiced to a tenant. (For context: ~16,280 kr/yr of municipal charges, plus 4 promille property tax, whose bunnfradrag Tromsø gutted to a token 10 kr in April 2026.)',
      }),
    ];
    if (c.in.transit === 'yes') {
      items.push(it('fees', 'Svipper 30-day pass (adult)', 562 * 12, {
        src: SRC.svipper, frequencyLabel: 'per year',
        formula: '562 kr/month × 12',
        facts: [['Adult 30-day (30–66)', '562 kr'],
                ['Young adult (18–29)', '265 kr'],
                ['Honnør (67+)', '231 kr'],
                ['Annual cost', '6,744 kr vs ≈60,000 kr to run the AMG'],
                ['Why so cheap', 'state belønningsmidler + a 2026 subsidy']],
        note: '6,744 kr/year against roughly 60,000 kr just to run the AMG. Tromsø has one of Norway\'s cheapest period tickets thanks to state belønningsmidler plus a temporary subsidy from 2026-05-01.',
      }));
    }
    return items;
  },
};

export const ASSETS = [emeya, ferrari, loft, gtr, tower, amg, arctic];

/* ------------------------------------------------------------------ */
/* Reality checks — things the numbers alone don't tell you            */
/* ------------------------------------------------------------------ */
export const CAVEATS = [
  {
    tag: 'The two Chinese assets are coupled',
    body:
      'If you rent a loft you almost certainly cannot install a wallbox, which pushes the Emeya from ¥2,188/yr ' +
      'of home charging to ¥4,620/yr of public charging and makes a paid parking space mandatory rather than ' +
      'optional. The default here assumes 40% home charging for that reason.',
    src: SRC.szElecConvert,
  },
  {
    tag: 'You cannot register the Ferrari in Shenzhen while you own the Emeya',
    body:
      'This is a gate, not a cost line. 《深圳市小汽车增量调控管理实施细则》第十五条(三) only grants ' +
      'the petrol-capable 普通小汽车增量指标 to an applicant with no car registered in Shenzhen, and the ' +
      'Emeya is registered to you. 第十六条 grants a second quota for 新能源 only. And selling the Emeya ' +
      'does not help: 第五十二条 makes the renewal quota match the original type, so a BEV-quota car yields ' +
      'a BEV renewal quota that still cannot register a petrol car. The workable routes are a company ' +
      'quota (a Shenzhen-registered firm that paid ¥50,000 of local tax last year, with the car titled to ' +
      'it), a family member with no Shenzhen car, a 沪牌 won at auction, or a non-粤B plate that is banned ' +
      'citywide on weekday peaks. Worth knowing: a Ferrari 296 GTB is a plug-in hybrid and qualifies for ' +
      'the free, uncapped 混合动力 quota as a legitimate second car — the plate problem disappears entirely.',
    src: SRC.szPlateRules,
  },
  {
    tag: 'A 沪牌 is the only route that works in your own name — and it is the dearest',
    body:
      'Shanghai\u2019s exclusion is narrower than Shenzhen\u2019s. 《上海市非营业性客车额度拍卖管理规定》' +
      '第七条 bars you only if you already hold a Shanghai 客车额度 or a car registered on one; the 交通委 ' +
      'FAQ states plainly that a car on another city\u2019s plate can stay registered. So the Emeya, which ' +
      'closes every 粤B door, is invisible in Shanghai. Two things make it expensive anyway. First, the ' +
      'quota cleared at ¥93,868 in 2026 第8期 against a ¥92,900 floor, with a 14.4% win rate — eight times ' +
      'the 粤B price and several months of bidding. Second, a non-沪籍 applicant needs a 上海居住证 plus ' +
      'twelve unbroken months of Shanghai social insurance or income tax; the February 2025 revision cut ' +
      'that from three years to one, which is what makes this route thinkable at all. The catch that ' +
      'decides it: driven in Shenzhen, a 沪牌 is just another 非粤B plate under the same weekday peak ban, ' +
      'so ¥93,868 buys you nothing a free out-of-town plate does not already give you — unless the car ' +
      'lives in Shanghai.',
    src: SRC.shPlateFaq,
  },
  {
    tag: 'The Ferrari pays every tax the Emeya dodges',
    body:
      'Same city, same buyer, opposite tax treatment. The Emeya paid a capped new-energy purchase tax and ' +
      'nothing else; the Ferrari pays the full 10% with no relief, ¥2,400 a year of 车船税 that BEVs are ' +
      'outside of entirely, and a plate that must be won at auction rather than handed over free. Around ' +
      '41% of the ¥2,598,500 sticker is already tax — 15% tariff, 25% import consumption tax, 10% embedded ' +
      'luxury tax, 13% VAT — and the purchase tax sits on top, so roughly half of what you hand over ' +
      'reaches the state. One consolation: at 3,855 cc it sits 145 cc below the 4.0-litre cliff where ' +
      'import consumption tax jumps from 25% to 40%.',
    src: SRC.cnImportTax,
  },
  {
    tag: 'Insuring a Ferrari in China may not be possible at any price',
    body:
      'CPIC\u2019s own consumer material documents Chinese insurers declining 车损险 on Ferraris and offering ' +
      'liability cover only, with one owner unable to insure a ¥3M car at all. The stated logic is ' +
      '"低保费、高赔付". Ferrari is not even in 中保研\u2019s 100-model 零整比 sample — where the petrol index ' +
      'already runs at 390.77% — so underwriters have no benchmark and price defensively. Uninsured ' +
      'own-damage exposure on a ¥2.6M car with ¥130,000–200,000 brakes is a different risk from what a ' +
      '¥70,000 premium suggests. Get a binding quote before you order.',
    src: SRC.cpicSupercar,
  },
  {
    tag: 'Options are taxed, and above ¥339,000 they are taxed at the full rate',
    body:
      'The 车辆购置税 base is everything you actually paid the seller excluding VAT, so factory options ' +
      'and dealer-fitted accessories invoiced with the car are inside it. The 2026–2027 NEV rule halves ' +
      'the 10% rate but caps the relief at ¥15,000 per car, which means the cap binds above roughly ' +
      '¥339,000 on the invoice — and beyond that point every extra yuan of options carries the full 10%, ' +
      'not 5%. On a ¥638,000 invoice the ¥50,000 of options cost ¥4,425 in tax by themselves. Keep ' +
      'accessories on a separate invoice where the dealer legitimately can; bundle them with the car and ' +
      'you are paying tax on them.',
    src: SRC.nevTaxQa,
  },
  {
    tag: 'The Emeya\'s real risk is repricing, not wear',
    body:
      'Lotus cut the entry MSRP from ¥668,000 to ¥538,000 in about 20 months and runs monthly incentive ' +
      'programmes. Every round re-anchors used values downward. A 14-month-old Emeya L+ that listed at ' +
      '¥668,000 new is now asking ¥440,400 — 65.9%. Three-year residuals across all Chinese BEVs average 45%.',
    src: SRC.guaziEmeya,
  },
  {
    tag: 'You cannot insure an early GT-R for what you pay for it',
    body:
      'This is the biggest unmodelled risk in the whole plan, and it is invisible until you request a quote. ' +
      'Real 2026 quotes on a 2008 R35 came back with a 車両保険 agreed value of ¥4.35–4.90M — against a ' +
      '¥9–10M purchase price. Write the car off and you are personally out roughly ¥5M. Worse, 三井ダイレクト ' +
      'refuses hull cover entirely at 20 years from registration and the industry hardens from 15, while ' +
      'classic-car policies do not start until 25 — so a 2008 car has a five-year insurance hole from 2028 ' +
      'to 2033. Get a binding quote with a stated 協定保険価額 on the specific chassis before you transfer money.',
    src: SRC.gtrIns723,
  },
  {
    tag: 'The GT-R gearbox is a binary risk, and driving gently does not protect you',
    body:
      'Motor Fan is explicit that GR6 failures occur on "ストリート最優先＆フルストック" cars, and that most ' +
      'surviving early R35s still run un-remediated boxes. The reactive path is ¥1.4M–2.7M; the preventive ' +
      'programme is ¥440,000–610,000. Treat that as part of the purchase price rather than optional ' +
      'maintenance. Separately, a specialist states plainly that many pre-2011 parts are already discontinued, ' +
      'and unlike the R32–R34 there is no NISMO Heritage programme for the R35 — a one-way ratchet with no ' +
      'cost ceiling.',
    src: SRC.gtrCring,
  },
  {
    tag: 'The GT-R may not physically fit your parking',
    body:
      'At 1,895 mm wide it exceeds many sedan-spec mechanical pallets, which dominate central Tokyo. ' +
      'Tower-mansion garage allocation is frequently by lottery — miss it and your space may be a ten-minute ' +
      'walk away. Budget 平面式 (surface) pricing.',
    src: SRC.jpParkShibuya,
  },
  {
    tag: 'Buying used in Norway skips the tax that makes new cars absurd',
    body:
      'Skatteetaten is unambiguous: on a car previously registered in Norway, "engangsavgiften og ' +
      'merverdiavgiften er allerede betalt". You pay only omregistreringsavgift — 1,942 kr for a 2014-or-older ' +
      'car, 4,532 kr for 2015–2022. A new AMG E 53 estate carries roughly 344,000 kr of engangsavgift inside ' +
      'its 1,487,900 kr list price; a 2019 one costs you 4,532 kr to put in your name. This single rule is why ' +
      'a NOK 700,000 budget reaches cars that cost 1.5M new. The exception to watch is a bruktimport never ' +
      'registered here, which attracts the full tax on import.',
    src: SRC.skattUsedCar,
  },
  {
    tag: 'The cheapest AMG to own is the oldest one, and that will feel wrong',
    body:
      'The 2013 W204 6.2 V8 works out roughly 30,000–37,000 kr a year cheaper to own than the W205 or the ' +
      'E 53, because near-zero depreciation more than pays for 17 l/100km and a fat repair contingency. What ' +
      'you buy instead is variance: its bad outcome arrives as a single invoice, no Norwegian insurer will ' +
      'write machine-damage cover on a 13-year-old car, and the appreciation thesis is explicitly conditional ' +
      'on documented head-bolt and camshaft repairs. On a W204, the engine serial number is worth more than ' +
      'the service book — the flaw affects engines below 60-060658.',
    src: SRC.carbuzzW204,
  },
  {
    tag: 'Rear-wheel drive and 500 hp, for 197 statutory winter days',
    body:
      'Norsk elbilforening tested this and their conclusion describes Tromsø exactly: modern two-wheel-drive ' +
      'cars are much better than they were, but "her er firehjulstrekkeren fortsatt den ubestridte kongen på ' +
      'haugen" for climbing from a standstill. Good studded tyres close most of the braking and cornering gap ' +
      '— NAF are clear that tyres matter more than drivetrain for stopping — but nothing closes the hill-start ' +
      'gap. If the AMG is your only car, take the 4MATIC. If you have a second winter car, the C 63 becomes a ' +
      'defensible toy.',
    src: SRC.elbil4wd,
  },
  {
    tag: 'Buy from a dealer, for legal reasons rather than emotional ones',
    body:
      'Forbrukerkjøpsloven gives you five years of reklamasjonsrett against a dealer, at a lower defect ' +
      'threshold, and a dealer cannot disclaim it. A private seller owes you two years and can validly ' +
      'disclaim. On a hand-built V8 with a documented catastrophic failure mode, the roughly 30,000–60,000 kr ' +
      'dealer premium is cheap. Read the contract for formidlingssalg though — if the dealer has clearly ' +
      'stated it is only brokering a private car, you drop back to two-year cover.',
    src: SRC.forbrukerDealer,
  },
  {
    tag: 'Lofoten\'s "long-term" rentals often end on 31 May',
    body:
      'Short-term tourist letting outcompetes long-term tenancy: Airbnb room-nights in Northern Norway are up ' +
      '160% since 2020, and employers including Lofotr Vikingmuseum now buy houses outright because they ' +
      'cannot rent for staff. One Bøstad listing advertises "langtidsleie" and then specifies 1 October to ' +
      '31 May. In Henningsvær and Reine, year-round whole-house stock is close to nonexistent — the citable ' +
      'listings are rooms in shared houses.',
    src: SRC.nrkAirbnb,
  },
  {
    tag: 'In Tromsø the AMG is the wrong tool',
    body:
      'A monthly Svipper pass is 562 kr — 6,744 kr a year against roughly 60,000 kr just to run the car, ' +
      'before depreciation. Meanwhile 15 toll stations ring Tromsøya including the bridge, airport and ' +
      'university, so driving within the city is itself taxed, and a 2.2-tonne car on 275-section low-profile ' +
      'tyres on salted, steep, ice-covered island roads through the polar night is a poor instrument ' +
      'regardless of 4MATIC+.',
    src: SRC.svipper,
  },
  {
    tag: 'Norgespris versus spot is close to a coin flip in NO4',
    body:
      'Norgespris fixes 40 øre/kWh (no VAT in the north), but NO4 spot averaged 38.95 øre across 2026 and only ' +
      'January and February exceeded the 77 øre strømstøtte trigger. Ordering Norgespris binds your meter to ' +
      '31 December 2026 and forfeits strømstøtte, so in the north it buys predictability at a small expected ' +
      'cost rather than a saving. It also has to be actively re-ordered for 2027 at a new price.',
    src: SRC.norgespris,
  },
  {
    tag: 'Salt is a cost no warranty covers',
    body:
      'Coastal Northern Norway combines heavy road salting with high humidity, and Dinitrol state plainly that ' +
      '"saltskader under bilen regnes som ytre påvirkning / slitasje og vil ikke dekkes av bilens garanti". Any ' +
      'car brought north needs treating on arrival — 12,000–20,000 kr, two to three days done properly, ' +
      're-treated within 36 months, and never in winter. Get the dealer\'s written approval first, because NAF ' +
      'warn that unauthorised treatment can void the factory rust warranty and some solvents damage seals. ' +
      'The one E 53 advert reading "understellsbehandlet ... fulgt opp på rebehandling hvert år" is worth more ' +
      'than most equipment lists.',
    src: SRC.dinitrolSalt,
  },
  {
    tag: 'The weakest numbers in this model',
    body:
      'Four lines deserve real quotes before you act on them. Emeya insurance, because the car has almost no ' +
      'Chinese loss history and insurers load NEVs heavily. GT-R tyre life, where the only published figure is ' +
      'trade opinion of about 10,000 km and it swings the annual budget by over ¥100,000. AMG insurance, which ' +
      'is scaled from a national average because no Norwegian insurer will price an AMG without a registration ' +
      'number and BankID. And AMG servicing, because Mercedes Norway publishes a fixed price for every model ' +
      'group except AMG, S-Class and G-Class.',
    src: SRC.noMachineCover,
  },
  {
    tag: 'And one non-financial gate',
    body:
      'Norway needs an oppholdstillatelse for a non-EEA national to work or stay beyond 90 days, usually via ' +
      'the skilled-worker route: a concrete offer from one employer, in a role that genuinely requires your ' +
      'qualifications. Housing is not a condition of the permit, but you need a D-number and BankID before ' +
      'you can open a depositumskonto or sign an electricity contract — and Tromsø landlords run credit ' +
      'checks. In Japan, the binding constraint is a residence card valid for longer than the two-year lease.',
    src: SRC.udiSkilled,
  },
];
