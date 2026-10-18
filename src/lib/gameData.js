const IMG_BASE = `${import.meta.env.BASE_URL}images`;

export const ITEMS = [
  { id: 'firstaid', label: 'עזרה ראשונה', correct: true, image: `${IMG_BASE}/b740024e7_.png`,
    explanation: 'לטיפול ראשוני בנפגעים עד להגעת כוחות רפואה.' },
  { id: 'headphones', label: 'אוזניות', correct: false, image: `${IMG_BASE}/33af0f8b9_.png`,
    explanation: 'חוסמות את השמיעה ומונעות שמיעת קריאות עזרה ופקודות.' },
  { id: 'mask', label: 'מסכת אבק', correct: true, image: `${IMG_BASE}/b8f05a38d_.png`,
    explanation: 'עשן, אסבסט ואבק בטון מסכנים את הריאות – המסכה מגינה על מערכת הנשימה.' },
  { id: 'vest', label: 'ווסט', correct: true, image: `${IMG_BASE}/b03ef7d12_.png`,
    explanation: 'וסט מגן מבליט את הלובש ומגן על האיברים החיוניים בשטח.' },
  { id: 'coffee', label: 'כוס קפה', correct: false, image: `${IMG_BASE}/78ccdb9bb_.png`,
    explanation: 'לא ניתן לאחוז בה בזמן עבודה ועלולה לגרום לכוויות.' },
  { id: 'helmet', label: 'קסדה', correct: true, image: `${IMG_BASE}/259b11c07_.png`,
    explanation: 'מגינה על הראש מפני נפילת פסולת ובניין – ציוד חובה בכל כניסה לאתר הרס.' },
  { id: 'gloves', label: 'כפפות', correct: true, image: `${IMG_BASE}/c6fa4e5f5_.png`,
    explanation: 'מגינות על הידיים מחתכים, שברי זכוכית וחפצים חדים בין ההריסות.' },
  { id: 'matkot', label: 'מטקות', correct: false, image: `${IMG_BASE}/f0dbe998a_.png`,
    explanation: 'ציוד פנאי לא מתאים לאתר הרס – רק יפריעו לכוחות החילוץ.' },
  { id: 'rope', label: 'חבל', correct: true, image: `${IMG_BASE}/f17fb364e_.png`,
    explanation: 'לחילוץ נפגעים, הבטחת כוחות ויצירת מעברים בטוחים.' },
  { id: 'flashlight', label: 'פנס', correct: true, image: `${IMG_BASE}/20bb21a18_.png`,
    explanation: 'אתרי הרס חשוכים לחלוטין – הפנס הוא העיניים בחושך.' },
  { id: 'radio', label: 'מכשיר קשר', correct: true, image: `${IMG_BASE}/bb2ec8ddf_.png`,
    explanation: 'תיאום עם שאר הכוחות הוא קריטי – הטלפון הרגיל לא תמיד עובד בחירום.' },
  { id: 'umbrella', label: 'מטריה', correct: false, image: `${IMG_BASE}/9c80634bf_.png`,
    explanation: 'לא רלוונטית באתר הרס ותפריע לתנועה בשטח.' },
  { id: 'wallet', label: 'אמצעי זיהוי', correct: true, image: `${IMG_BASE}/b09fcbc6f_image-093e6855-6049-4bee-b998-c08ba2077712-0.png`,
    explanation: 'תעודת זהות או תג זיהוי חשובים לזיהוי מהיר שלך ושל הכוחות באתר האסון.' },
  { id: 'boots', label: 'מגפיים', correct: true, image: `${IMG_BASE}/960eee39a_.png`,
    explanation: 'מגינות על הרגליים ממסמרים וחפצים חדים בין ההריסות.' },
  { id: 'flipflops', label: 'כפכפים', correct: false, image: `${IMG_BASE}/d94009592_.png`,
    explanation: 'מסוכנים בשטח הרוס – לא מספקים כל הגנה ואין להם אחיזה בהריסות.' },
];

export const CORRECT_COUNT = ITEMS.filter(i => i.correct).length;
export const WRONG_COUNT = ITEMS.filter(i => !i.correct).length;

// נקודות עגינה אנטומיות על גוף הדמות (אחוזים מתוך תמונת הדמות הפעילה)
export const ANCHORS = {
  helmet:     { top: '3%',  left: '32%', w: '36%' },
  headphones: { top: '6%',  left: '27%', w: '46%' },
  mask:       { top: '15%', left: '35%', w: '30%' },
  vest:       { top: '29%', left: '25%', w: '50%' },
  firstaid:   { top: '33%', left: '30%', w: '40%' },
  gloves:     { top: '50%', left: '13%', w: '26%' },
  boots:      { top: '74%', left: '27%', w: '46%' },
  flipflops:  { top: '76%', left: '30%', w: '40%' },
  rope:       { top: '56%', left: '27%', w: '46%' },
  flashlight: { top: '54%', left: '34%', w: '32%' },
  radio:      { top: '52%', left: '30%', w: '40%' },
  wallet:     { top: '22%', left: '38%', w: '24%' },
  coffee:     { top: '46%', left: '34%', w: '32%' },
  matkot:     { top: '40%', left: '17%', w: '56%' },
  umbrella:   { top: '-6%', left: '30%', w: '40%' },
};