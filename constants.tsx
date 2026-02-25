
import { AchievementType, Achievement, SocialInitiative, Talent, Project, Newborn, Newlywed, FamilyMember } from './types';

export const FAMILY_NAME = "أواصر";
export const FAMILY_DESCENDANTS = "ذرية علي أحمد مليباري";
export const FOUNDER_NAME = "علي أحمد مليباري";
export const FOUNDER_BIO = "العميد والمؤسس لعائلة مليباري، الذي غرس في ذريته حب الخير والترابط، وبنى إرثاً يفتخر به أبناؤه وأحفاده.";

export const MOCK_TREE: FamilyMember = {
  id: "gen1",
  name: "الجد علي أحمد مليباري",
  gender: "male",
  isDeceased: true,
  spouse: "",
  children: [
    {
      id: "gen2-1",
      name: "محي الدين ",
      gender: "male",
      isDeceased: true,
      spouse: "",
      children: [
        {
          id: "gen3-1",
          name: "علوي",
          gender: "male",
          isDeceased: true,
          spouse: "فاطمة محمد مليباري",
          children: [
            {
              id: "gen4-1",
              name: "هاشم ",
              gender: "male",
              spouse: "عفراء محمد نور تركستاني",
              children: [
                {
                  id: "gen5-1",
                  name: "فارس ",
                  gender: "male",
                  spouse: "رنيم اياد سندي",
                  children: [
                    { id: "gen6-1", name: "هاشم ", gender: "male" }
                  ]
                },
                {
                  id: "m-6duder2uq9",
                  name: "فراس ",
                  gender: "male",
                  spouse: "ميس عبدالله معاجيني"
                },
                { id: "m-ijgq372nz7l", name: "مازن ", gender: "male" },
                { id: "m-tqb371lhhnk", name: "علوي ", gender: "male" },
                { id: "m-7kyxefncgrw", name: "عمار ", gender: "male" },
                { id: "m-rl4wmabbgv9", name: "ماجد ", gender: "male" },
                { id: "m-qk9znetl2v", name: "يوسف ", gender: "male" }
              ]
            },
            {
              id: "m-ixm4xzzenys",
              name: "علاء ",
              gender: "male",
              spouse: "شهد عادل ساعاتي",
              children: [
                { id: "m-jjht3fi1z1", name: "مؤيد ", gender: "male" },
                { id: "m-qtb1mkjwunf", name: "مهاب ", gender: "male" },
                { id: "m-lynbtvvpp2h", name: "ميرال", gender: "female" }
              ]
            },
            {
              id: "m-fzgona7x475",
              name: "بهاء ",
              gender: "male",
              spouse: "دينا ضيف الله السليماني",
              children: [
                { id: "m-tms55bcgwhj", name: "عبداللطيف ", gender: "male" },
                { id: "m-d1tqhkaode5", name: "نور ", gender: "female" },
                { id: "m-4a41hy1etex", name: "جود ", gender: "female" },
                { id: "m-x1fbh3qy8m", name: "يسر", gender: "female" }
              ]
            },
            {
              id: "m-da45euw3o4f",
              name: "البراء ",
              gender: "male",
              spouse: "اسراء محي الدين قدح"
            },
            { id: "m-1lk4rbn1plw", name: "عبد العزيز ", gender: "male" },
            { id: "m-p45lff50ctp", name: "شهلاء عبداللطيف مليباري", gender: "female" },
            { id: "m-uwl3z968wt", name: "عبداللطيف", gender: "male", spouse: "فاطمة اكاس خياط" },
            {
              id: "m-g9dl60c9b16",
              name: "اسامه ",
              gender: "male",
              isDeceased: true,
              spouse: "فايزه محمد نور تركستاني",
              children: [
                { id: "m-jp4fzk4stli", name: "زياد ", gender: "male", spouse: "دانيه سعود الحازمي" },
                { id: "m-t34o4r69ttf", name: "مرام ", "gender": "female", "spouse": "عبدالعزيز منشي" },
                { id: "m-fnm9hngk91h", name: "اروى اسامه مليباري", "gender": "female" },
                { id: "m-dpvtz46qb46", name: "بيان ", "gender": "female", "spouse": "وليد الغبيشي" },
                { id: "m-uplzbkatcz", "name": "روان ", "gender": "female", "spouse": "عبدالله حميدان" },
                { id: "m-qbku926shw", "name": "رزان ", "gender": "female" },
                { id: "m-36dhfpiii3t", "name": "نوران ", "gender": "female" }
              ]
            },
            {
              id: "m-jt7qxwjuss",
              name: "عبدالعزيز ",
              gender: "male",
              isDeceased: true,
              spouse: " ايمان بخاري ",
              children: [
                { id: "m-ua2ow1zlfg", name: "شيماء ", gender: "female" }
              ]
            },
            { "id": "m-qfthca6ylxa", "name": "زكية ", "gender": "female", "spouse": "جمال الصعيدي" },
            { "id": "m-lczwdsnxca", "name": "رحمة ", "gender": "female", "isDeceased": true, "spouse": "سعود العتيبي" },
            { "id": "m-pwrxfxzxhh", "name": "سميرة ", "gender": "female", "spouse": "عامر باكيلي" },
            { "id": "m-v676pa9l1eo", "name": "جميلة ", "gender": "female" },
            { "id": "m-6aa7aa6wdbk", "name": "عبدالله ", "gender": "male" }
          ]
        },
        {
          id: "m-rxlqkbjlqq",
          name: "علي ",
          gender: "male",
          children: [
            {
              id: "m-68dlh1tuz4x",
              name: "سامي ",
              gender: "male",
              spouse: "مريم عثمان مليباري",
              children: [
                { "id": "m-90bz62br80d", "name": "محمد سامي مليباري", "gender": "male" },
                { "id": "m-5jntruvzog7", "name": "عبدالله سامي مليباري", "gender": "male" },
                { "id": "m-5k04i142qbk", "name": "بسام سامي مليباري", "gender": "male" },
                { "id": "m-ivr1x3yfj2", "name": "أصيل سامي مليباري", "gender": "male" },
                { "id": "m-118p4cue8fpm", "name": "ضحى سامي مليباري", "gender": "female" },
                { "id": "m-sj8mhzzltti", "name": "سجى سامي مليباري", "gender": "female" }
              ]
            },
            {
              id: "m-9a7r531zyc5",
              name: "جعفر ",
              gender: "male",
              spouse: "روتانا بكر مفتي",
              children: [
                { "id": "m-865jgmhvj2h", "name": "جنى ", "gender": "female" },
                { "id": "m-ed5gqa0vzhp", "name": "سنا ", "gender": "female" },
                { "id": "m-rd6lqmwfvwc", "name": "ميار ", "gender": "female" },
                { "id": "m-al2azueuukq", "name": "رفال ", "gender": "female" }
              ]
            },
            {
              id: "m-m2dgubidqjh",
              name: "محمد ",
              gender: "male",
              spouse: "عائشة بكر مليباري",
              children: [
                {
                  id: "m-dd7mr5nmm8d",
                  name: "ايمن ",
                  gender: "male",
                  spouse: "عهد هاشم مليباري",
                  children: [
                    { "id": "m-f0vchvt0c1a", "name": "مهند ", "gender": "male" },
                    { "id": "m-zg48pkrfuro", "name": "هتان", "gender": "male" }
                  ]
                },
                { "id": "m-a4ti892ulou", "name": "فاديه ", "gender": "female" },
                { "id": "m-13fro90o67v", "name": "داليا ", "gender": "female" },
                { "id": "m-0qpfsoo8ciz", "name": "دانيه", "gender": "female" },
                { "id": "m-2pu5tvnj9w8", "name": "أبرار ", "gender": "female" }
              ]
            },
            { "id": "m-iyxfzn13f8", "name": "عائشة ", "gender": "female" },
            { "id": "m-ch99ak87tbg", "name": "زينب ", "gender": "female" },
            { "id": "m-22i4y9xhqgv", "name": "رقية ", "gender": "female" },
            { "id": "m-0ejmmhh05gw9", "name": "اسماء ", "gender": "female", "isDeceased": true },
            { "id": "m-othv3fvy289", "name": "سعدية ", "gender": "female", "isDeceased": true },
            { "id": "m-l7hr6pzound", "name": "زليخة ", "gender": "female" }
          ]
        },
        {
          id: "m-81krv219jwd",
          name: "أمين",
          gender: "male",
          isDeceased: true,
          spouse: "عائشة علوي مليباري",
          children: [
            {
              id: "m-ydtdcsmoka",
              name: "فيصل ",
              gender: "male",
              spouse: " شروق عبد السلام مال",
              children: [
                { "id": "m-pdfy22b99le", "name": "أمين ", "gender": "male" },
                { "id": "m-5k1c1iudadn", "name": "معاذ ", "gender": "male" },
                { "id": "m-w6444tm6bjb", "name": "صهيب ", "gender": "male" },
                { "id": "m-q0a9lafeb5", "name": "فرح ", "gender": "female" },
                { "id": "m-4wb5no73md7", "name": "ديالا ", "gender": "female" }
              ]
            },
            {
              id: "m-hh8ym8t06a7",
              name: "وليد ",
              gender: "male",
              spouse: " منال احمد المرضاحي",
              children: [
                { "id": "m-cy6xnt836ur", "name": "فيصل ", "gender": "male" },
                { "id": "m-j4aq2gf0wo", "name": "لارين ", "gender": "female" },
                { "id": "m-zw1qgiaop0l", "name": "روين ", "gender": "female" }
              ]
            },
            {
              id: "m-0a7nnfqcyk8",
              name: "اشرف ",
              gender: "male",
              spouse: "سهى احسان مكي وزوجته الثانية سميره عرمان الصبحي ",
              children: [
                { "id": "m-ohm71gy18ea", "name": "وصال ", "gender": "female" },
                { "id": "m-9g7mluk2o5b", "name": "حلا ", "gender": "female" },
                { "id": "m-6zso11bt016", "name": "اسامه ", "gender": "male" },
                { "id": "m-pcd9z6mon6", "name": "عبدالعزيز ", "gender": "male" }
              ]
            },
            {
              id: "m-s79q77n0nln",
              name: "عثمان",
              gender: "male",
              spouse: "غيداء سراج غبره",
              children: [
                { "id": "m-p0i8qe2dvn", "name": "عمار ", "gender": "male" },
                { "id": "m-7tgqa6kd83a", "name": "عمر ", "gender": "male" },
                { "id": "m-qceudowftwb", "name": "تاليه ", "gender": "female" }
              ]
            },
            { "id": "m-tvdie86n5a", "name": "بدرية ", "gender": "female", "spouse": "حامد حمزه مليباري" },
            { "id": "m-dsx3qbqu1bb", "name": "تساهيل ", "gender": "female", "spouse": " طلال حكيم" },
            { "id": "m-tp43wqu8m8", "name": "شريفة ", "gender": "female" }
          ]
        },
        { "id": "m-bk9iot4fw8i", "name": "صفية ", "gender": "female" }
      ]
    },
    {
      id: "m-sw3cwrefc49",
      name: "محمد علي ",
      gender: "male",
      isDeceased: true,
      spouse: "فاطمة محمد كتي",
      children: [
        {
          id: "m-x8cziznsjsp",
          name: "محمد علي ",
          gender: "male",
          isDeceased: true,
          spouse: "زينب علي مليباري",
          children: [
            { id: "m-f5wmub3onj6", name: "ريهام ", gender: "female", spouse: "عثمان محمد بن علي" },
            { id: "m-utc38tkxih", name: "ريهاف ", gender: "female", spouse: " علاء مغربي" }
          ]
        },
        {
          id: "m-c8e8pxhacuf",
          name: "عبد الرزاق ",
          gender: "male",
          spouse: "عبير عبدالكريم صوفي",
          children: [
            {
              id: "m-925cscdw59a",
              name: "احمد ",
              gender: "male",
              spouse: " سارة فوزي قستي",
              children: [
                { "id": "m-whqfu2cc7di", "name": "عبد الرزاق", "gender": "male" },
                { "id": "m-v0gesxjlo9f", "name": "يزيد", "gender": "male" }
              ]
            },
            { "id": "m-ungt5b6881", "name": "انس ", "gender": "male" },
            { "id": "m-w5pimyggee", "name": "يامن ", "gender": "male" },
            { "id": "m-tz0tl1t8mhr", "name": "الاء ", "gender": "female", "spouse": " ياسر الأهدل" },
            { "id": "m-ykx4xvz5b6q", "name": " ايلاف ", "gender": "female", "spouse": " محمد قاري" },
            { "id": "m-3i56eanoh8v", "name": "🔴 رغد ", "gender": "female", "spouse": " ريان شافعي " },
            { "id": "m-0frf0k3ogfe", "name": "ليان ", "gender": "female" }
          ]
        },
        { "id": "m-o5mxfeh5fb8", "name": "امنه ", "gender": "female" },
        { "id": "m-99hkdsj32il", "name": "زينب", "gender": "female", "isDeceased": true },
        { "id": "m-kcc79x1vxhe", "name": "مريم ", "gender": "female", "spouse": "عبدالسلام عبدالله مليباري" },
        { "id": "m-alqee4oibtt", "name": "اسيا", "gender": "female", "spouse": "عبدالله عبدالرحمن منشي" },
        {
          id: "m-9ovivesj40j",
          name: "عبدالله ",
          gender: "male",
          spouse: "وجنات محمد نور كلثوم",
          children: [
            { "id": "m-izj6n23ulym", "name": "أجوان ", "gender": "female" },
            { "id": "m-w5svqkxjj7n", "name": "أناجي ", "gender": "female" },
            {
              id: "m-arkjxs5eo9p",
              name: "عُلا ",
              gender: "female",
              spouse: "عبدالله جميل",
              children: [
                { "id": "m-cpdn8he38j7", "name": "يارا", "gender": "female" }
              ]
            },
            { id: "m-i76m7cqtigf", name: " محمد ", gender: "male", spouse: "مها الزبيدي" },
            { id: "m-gv5lg2gu14c", name: "مجد ", gender: "male", spouse: " غيداء عوفي" },
            { "id": "m-trn4dtbwu7i", "name": "جواد ", "gender": "male" }
          ]
        },
        {
          id: "m-tu16wyi16n",
          name: "عبدالباسط",
          gender: "male",
          spouse: " مرام غازي مشهور",
          children: [
            { "id": "m-8b09f0lvl4", "name": "رمزي", "gender": "male" },
            { "id": "m-0ysn1c0c44yl", "name": "رامز", "gender": "male" },
            { "id": "m-ka426mcgb5p", "name": "رائف", "gender": "male" }
          ]
        },
        {
          id: "m-v5jeoa25itd",
          name: "إبراهيم ",
          gender: "male",
          spouse: " ابتسام معتوق حزام",
          children: [
            { "id": "m-7x5zeaey8ut", "name": "فاطمة ", "gender": "female" },
            { "id": "m-iq7qjhx41mg", "name": "وجنات ", "gender": "female" },
            { "id": "m-8fwy95y4ri4", "name": "اسراء", "gender": "female" },
            { "id": "m-ld8osvvzat", "name": "يزن ", "gender": "male" }
          ]
        }
      ]
    },
    {
      id: "m-pw1kcybk9cc",
      name: "عبدالله علي ",
      gender: "male",
      isDeceased: true,
      spouse: "خديجة مليباري",
      children: [
        {
          id: "m-39bhvctz519",
          name: "عبدالرحمن ",
          gender: "male",
          spouse: "فاطمة الزهراء",
          children: [
            { "id": "m-hsikmtyxtpp", "name": "محمد ", "gender": "male" },
            { "id": "m-mhabxb408wm", "name": "عبدالباسط ", "gender": "male" },
            { "id": "m-1dchwt1ljl2", "name": "سهله ", "gender": "female" },
            { "id": "m-yjcix3b26gg", "name": "روفاده", "gender": "female" }
          ]
        },
        { "id": "m-9n3gl5itsnv", "name": "عيشة ", "gender": "female" },
        { "id": "m-o2gbhbp9nf", "name": "جميلة ", "gender": "female" },
        { "id": "m-esv4wnpbmf", "name": "ام كلثوم ", "gender": "female" },
        { "id": "m-xq3kbd1x9i", "name": "فاطمة ", "gender": "female" },
        { "id": "m-cij1pmbl6ro", "name": "صفية ", "gender": "female" },
        { "id": "m-dx7d0m7lqhd", "name": "زبيدة ", "gender": "female" },
        { "id": "m-dux8awtgfwh", "name": "امنه ", "gender": "female" },
        {
          id: "m-0bdlx8nvldc",
          name: "عثمان ",
          gender: "male",
          spouse: " =نور جيهان",
          children: [
            { "id": "m-8qlowhg7rkl", "name": "شيماء ", "gender": "female" },
            { "id": "m-wdglujx32ja", "name": "شهبه ", "gender": "female" },
            { "id": "m-ezlhsz7ionm", "name": "شهلاء ", "gender": "female" },
            { "id": "m-5farcqimbyn", "name": "نافع ", "gender": "male" },
            { "id": "m-eviy5oqvg0o", "name": "عبد الناصف ", "gender": "male" }
          ]
        },
        {
          id: "m-udwd4bj2g7q",
          name: "عبدالرزاق ",
          gender: "male",
          spouse: "عارفه مليباري",
          children: [
            { "id": "m-b607jm0qhzs", "name": "ريماس ", "gender": "female" },
            { "id": "m-dzl2ogald4b", "name": "ريناد ", "gender": "female" },
            { "id": "m-6ll1zcbzohr", "name": "رغده", "gender": "female" },
            { "id": "m-11hjlcpg5rwj", "name": "ريان ", "gender": "male" }
          ]
        }
      ]
    },
    {
      id: "m-72awhvp4aq7",
      name: "شيكو علي ",
      gender: "male",
      isDeceased: true,
      spouse: "",
      children: [
        {
          id: "m-xg5ygve0zf",
          name: "محمد ",
          gender: "male",
          spouse: "ميمونه مليباري",
          children: [
            { "id": "m-ejzvnilg4ra", "name": "ناصر ", "gender": "male" },
            { "id": "m-vy6udk0vtj", "name": "مريم ", "gender": "female" }
          ]
        },
        {
          id: "m-um9jadc8tfl",
          name: "عبّدالرحمن",
          gender: "male",
          isDeceased: true,
          spouse: " زينب مليباري",
          children: [
            { "id": "m-xz51cttek7j", "name": "بشير ", "gender": "male" },
            { "id": "m-3myif7lpa4x", "name": "علوي عبّد ", "gender": "male" },
            { "id": "m-phx89kb2m", "name": "صفية ", "gender": "female" },
            { "id": "m-xzqgmvep2tp", "name": "خديجه ", "gender": "female" }
          ]
        },
        {
          id: "m-lgutc9t8ru",
          name: "عبدالكريم ",
          gender: "male",
          isDeceased: true,
          spouse: "فاطمة مليباري",
          children: [
            { "id": "m-bzokvw3cbm", "name": "حفصة ", "gender": "female" },
            { "id": "m-r4wejpzal8", "name": "اشرف ", "gender": "male" },
            { "id": "m-rbqhdv26grp", "name": "حسينه ", "gender": "female" },
            { "id": "m-enm48rjomiv", "name": "شريفة ", "gender": "female" },
            { "id": "m-heyelhcot39", "name": "خيريه ", "gender": "female" },
            { "id": "m-3699t4ybhz", "name": "سميره ", "gender": "female" },
            { "id": "m-p4i6kigaxwq", "name": "صفية ", "gender": "female" }
          ]
        },
        {
          id: "m-t1adc9vj1pr",
          name: "عبدالحميد ",
          gender: "male",
          isDeceased: true,
          spouse: "رقية مليباري",
          children: [
            { "id": "m-bdrqphjexjd", "name": "رجينه ", "gender": "female" },
            { "id": "m-p263qi3btvd", "name": "فاطمة ", "gender": "female" },
            { "id": "m-pv8mnd1wuv9", "name": "عبدالرشيد ", "gender": "male" },
            { "id": "m-4820ux3hkxh", "name": "محمد شميم ", "gender": "male" },
            { "id": "m-qq99n1t92z", "name": "محمد سياس ", "gender": "male" },
            { id: "m-z2ejggx6io", name: " عبدالله ", gender: "male", spouse: " رقية" }
          ]
        },
        {
          id: "m-6q6szwnvrxf",
          name: "عبدالقادر ",
          gender: "male",
          isDeceased: true,
          spouse: "زهره مليباري",
          children: [
            { "id": "m-ktdw6kxmvzh", "name": "فيصل ", "gender": "male" },
            { "id": "m-ov4q5q20h68", "name": "جميله ", "gender": "female" },
            { "id": "m-tftanf679q", "name": "جيسل ", "gender": "female" }
          ]
        },
        {
          id: "m-7rrjy63cgb4",
          name: "عبدالحكيم ",
          gender: "male",
          spouse: "امنه مليباري",
          children: [
            { "id": "m-54bswtvko9i", "name": "فيروز ", "gender": "female" },
            { "id": "m-mm78tnkngdo", "name": "فايزه ", "gender": "female" },
            { "id": "m-nuwn5jv7z", "name": "جسيل ", "gender": "female" },
            { "id": "m-iz00v6b0mcp", "name": "فايز ", "gender": "male" }
          ]
        },
        { "id": "m-i39n4mhvx4f", "name": "خديجة ", "gender": "female" },
        { "id": "m-rv5dabqy2jp", "name": " فاطمة ", "gender": "female" },
        { "id": "m-i6rkc4fmo1", "name": " امنه ", "gender": "female" }
      ]
    },
    {
      id: "m-33hu72wrhzc",
      name: "علوي ",
      gender: "male",
      isDeceased: true,
      spouse: "مريم مليباري"
    },
    {
      id: "m-9r2gbrs6qpe",
      name: "احمد ",
      gender: "male",
      isDeceased: true
    }
  ]
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'د. أحمد مليباري', type: AchievementType.PHD, description: 'دكتوراه في علوم الحاسب من جامعة الملك سعود', year: '2023', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'أ. سارة مليباري', type: AchievementType.MASTERS, description: 'ماجستير في إدارة الأعمال الدولية من جامعة الملك عبدالعزيز', year: '2024', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
];

export const MOCK_INITIATIVES: SocialInitiative[] = [
  { id: '1', title: 'حملة إفطار صائم بمكة', description: 'إحياءً لذكرى الجد، بادر شباب العائلة بتوزيع الوجبات في أحياء مكة المكرمة.', date: 'رمضان 1445', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800' },
];

export const MOCK_NEWBORNS: Newborn[] = [
  { id: '1', name: 'نورة', parents: 'خالد محمد مليباري', date: 'شوال 1445', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'محي الدين', parents: 'عبدالله أحمد مليباري', date: 'رمضان 1445', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?auto=format&fit=crop&q=80&w=400' }
];

export const MOCK_NEWLYWEDS: Newlywed[] = [
  { id: '1', names: 'فهد مليباري & كريمة آل فلان', date: 'رجب 1445', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800' }
];

export const MOCK_TALENTS: Talent[] = [
  { id: '1', owner: 'نورة مليباري', talentType: 'رسم', title: 'لوحات تراثية مكية', content: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200', description: 'مجموعة من الرسومات تحاكي الزوايا العتيقة في مكة.', date: '١٤٤٥ هـ' }
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', owner: 'ليلى مليباري', name: 'متجر شغف', description: 'مشروع متخصص في الهدايا اليدوية والتغليف الفاخر.', link: '#', logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=200' },
];
