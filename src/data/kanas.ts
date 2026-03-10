export type KanaType = "hiragana" | "katakana";
export type KanaCategory = "basic" | "dakuten" | "combination";

export interface Kana {
  id: string;          // ex: "ka_hiragana" ou "ka_katakana"
  character: string;   // le caractère affiché
  romaji: string;
  type: KanaType;
  group: string;
  category: KanaCategory;
}

export interface KanaGroup {
  id: string;
  labelKey: string;
  hiragana: Kana[];
  katakana: Kana[];
}

// Helper pour construire les paires
function pair(
  group: string,
  category: KanaCategory,
  romaji: string,
  hira: string,
  kata: string
): { h: Kana; k: Kana } {
  return {
    h: { id: `${romaji}_hiragana`, character: hira, romaji, type: "hiragana", group, category },
    k: { id: `${romaji}_katakana`, character: kata, romaji, type: "katakana", group, category },
  };
}

// ─── BASIC ───────────────────────────────────────────────────────────────────

const basicRaw = [
  { id: "vowels", labelKey: "vowels", pairs: [
    pair("vowels", "basic", "a",  "あ", "ア"),
    pair("vowels", "basic", "i",  "い", "イ"),
    pair("vowels", "basic", "u",  "う", "ウ"),
    pair("vowels", "basic", "e",  "え", "エ"),
    pair("vowels", "basic", "o",  "お", "オ"),
  ]},
  { id: "k", labelKey: "k", pairs: [
    pair("k", "basic", "ka", "か", "カ"),
    pair("k", "basic", "ki", "き", "キ"),
    pair("k", "basic", "ku", "く", "ク"),
    pair("k", "basic", "ke", "け", "ケ"),
    pair("k", "basic", "ko", "こ", "コ"),
  ]},
  { id: "s", labelKey: "s", pairs: [
    pair("s", "basic", "sa",  "さ", "サ"),
    pair("s", "basic", "shi", "し", "シ"),
    pair("s", "basic", "su",  "す", "ス"),
    pair("s", "basic", "se",  "せ", "セ"),
    pair("s", "basic", "so",  "そ", "ソ"),
  ]},
  { id: "t", labelKey: "t", pairs: [
    pair("t", "basic", "ta",  "た", "タ"),
    pair("t", "basic", "chi", "ち", "チ"),
    pair("t", "basic", "tsu", "つ", "ツ"),
    pair("t", "basic", "te",  "て", "テ"),
    pair("t", "basic", "to",  "と", "ト"),
  ]},
  { id: "n_row", labelKey: "n_row", pairs: [
    pair("n_row", "basic", "na", "な", "ナ"),
    pair("n_row", "basic", "ni", "に", "ニ"),
    pair("n_row", "basic", "nu", "ぬ", "ヌ"),
    pair("n_row", "basic", "ne", "ね", "ネ"),
    pair("n_row", "basic", "no", "の", "ノ"),
  ]},
  { id: "h", labelKey: "h", pairs: [
    pair("h", "basic", "ha", "は", "ハ"),
    pair("h", "basic", "hi", "ひ", "ヒ"),
    pair("h", "basic", "fu", "ふ", "フ"),
    pair("h", "basic", "he", "へ", "ヘ"),
    pair("h", "basic", "ho", "ほ", "ホ"),
  ]},
  { id: "m", labelKey: "m", pairs: [
    pair("m", "basic", "ma", "ま", "マ"),
    pair("m", "basic", "mi", "み", "ミ"),
    pair("m", "basic", "mu", "む", "ム"),
    pair("m", "basic", "me", "め", "メ"),
    pair("m", "basic", "mo", "も", "モ"),
  ]},
  { id: "y", labelKey: "y", pairs: [
    pair("y", "basic", "ya", "や", "ヤ"),
    pair("y", "basic", "yu", "ゆ", "ユ"),
    pair("y", "basic", "yo", "よ", "ヨ"),
  ]},
  { id: "r", labelKey: "r", pairs: [
    pair("r", "basic", "ra", "ら", "ラ"),
    pair("r", "basic", "ri", "り", "リ"),
    pair("r", "basic", "ru", "る", "ル"),
    pair("r", "basic", "re", "れ", "レ"),
    pair("r", "basic", "ro", "ろ", "ロ"),
  ]},
  { id: "w", labelKey: "w", pairs: [
    pair("w", "basic", "wa", "わ", "ワ"),
    pair("w", "basic", "wo", "を", "ヲ"),
  ]},
  { id: "n", labelKey: "n", pairs: [
    pair("n", "basic", "n", "ん", "ン"),
  ]},
];

const dakutenRaw = [
  { id: "g", labelKey: "g", pairs: [
    pair("g", "dakuten", "ga", "が", "ガ"),
    pair("g", "dakuten", "gi", "ぎ", "ギ"),
    pair("g", "dakuten", "gu", "ぐ", "グ"),
    pair("g", "dakuten", "ge", "げ", "ゲ"),
    pair("g", "dakuten", "go", "ご", "ゴ"),
  ]},
  { id: "z", labelKey: "z", pairs: [
    pair("z", "dakuten", "za", "ざ", "ザ"),
    pair("z", "dakuten", "ji", "じ", "ジ"),
    pair("z", "dakuten", "zu", "ず", "ズ"),
    pair("z", "dakuten", "ze", "ぜ", "ゼ"),
    pair("z", "dakuten", "zo", "ぞ", "ゾ"),
  ]},
  { id: "d", labelKey: "d", pairs: [
    pair("d", "dakuten", "da",  "だ", "ダ"),
    pair("d", "dakuten", "dji", "ぢ", "ヂ"),
    pair("d", "dakuten", "dzu", "づ", "ヅ"),
    pair("d", "dakuten", "de",  "で", "デ"),
    pair("d", "dakuten", "do",  "ど", "ド"),
  ]},
  { id: "b", labelKey: "b", pairs: [
    pair("b", "dakuten", "ba", "ば", "バ"),
    pair("b", "dakuten", "bi", "び", "ビ"),
    pair("b", "dakuten", "bu", "ぶ", "ブ"),
    pair("b", "dakuten", "be", "べ", "ベ"),
    pair("b", "dakuten", "bo", "ぼ", "ボ"),
  ]},
  { id: "p", labelKey: "p", pairs: [
    pair("p", "dakuten", "pa", "ぱ", "パ"),
    pair("p", "dakuten", "pi", "ぴ", "ピ"),
    pair("p", "dakuten", "pu", "ぷ", "プ"),
    pair("p", "dakuten", "pe", "ぺ", "ペ"),
    pair("p", "dakuten", "po", "ぽ", "ポ"),
  ]},
];

const combinationsRaw = [
  { id: "ky", labelKey: "ky", pairs: [
    pair("ky", "combination", "kya", "きゃ", "キャ"),
    pair("ky", "combination", "kyu", "きゅ", "キュ"),
    pair("ky", "combination", "kyo", "きょ", "キョ"),
  ]},
  { id: "sy", labelKey: "sy", pairs: [
    pair("sy", "combination", "sha", "しゃ", "シャ"),
    pair("sy", "combination", "shu", "しゅ", "シュ"),
    pair("sy", "combination", "sho", "しょ", "ショ"),
  ]},
  { id: "ty", labelKey: "ty", pairs: [
    pair("ty", "combination", "cha", "ちゃ", "チャ"),
    pair("ty", "combination", "chu", "ちゅ", "チュ"),
    pair("ty", "combination", "cho", "ちょ", "チョ"),
  ]},
  { id: "ny", labelKey: "ny", pairs: [
    pair("ny", "combination", "nya", "にゃ", "ニャ"),
    pair("ny", "combination", "nyu", "にゅ", "ニュ"),
    pair("ny", "combination", "nyo", "にょ", "ニョ"),
  ]},
  { id: "hy", labelKey: "hy", pairs: [
    pair("hy", "combination", "hya", "ひゃ", "ヒャ"),
    pair("hy", "combination", "hyu", "ひゅ", "ヒュ"),
    pair("hy", "combination", "hyo", "ひょ", "ヒョ"),
  ]},
  { id: "my", labelKey: "my", pairs: [
    pair("my", "combination", "mya", "みゃ", "ミャ"),
    pair("my", "combination", "myu", "みゅ", "ミュ"),
    pair("my", "combination", "myo", "みょ", "ミョ"),
  ]},
  { id: "ry", labelKey: "ry", pairs: [
    pair("ry", "combination", "rya", "りゃ", "リャ"),
    pair("ry", "combination", "ryu", "りゅ", "リュ"),
    pair("ry", "combination", "ryo", "りょ", "リョ"),
  ]},
  { id: "gy", labelKey: "gy", pairs: [
    pair("gy", "combination", "gya", "ぎゃ", "ギャ"),
    pair("gy", "combination", "gyu", "ぎゅ", "ギュ"),
    pair("gy", "combination", "gyo", "ぎょ", "ギョ"),
  ]},
  { id: "zy", labelKey: "zy", pairs: [
    pair("zy", "combination", "ja",  "じゃ", "ジャ"),
    pair("zy", "combination", "ju",  "じゅ", "ジュ"),
    pair("zy", "combination", "jo",  "じょ", "ジョ"),
  ]},
  { id: "dy", labelKey: "dy", pairs: [
    pair("dy", "combination", "dya", "ぢゃ", "ヂャ"),
    pair("dy", "combination", "dyu", "ぢゅ", "ヂュ"),
    pair("dy", "combination", "dyo", "ぢょ", "ヂョ"),
  ]},
  { id: "by", labelKey: "by", pairs: [
    pair("by", "combination", "bya", "びゃ", "ビャ"),
    pair("by", "combination", "byu", "びゅ", "ビュ"),
    pair("by", "combination", "byo", "びょ", "ビョ"),
  ]},
  { id: "py", labelKey: "py", pairs: [
    pair("py", "combination", "pya", "ぴゃ", "ピャ"),
    pair("py", "combination", "pyu", "ぴゅ", "ピュ"),
    pair("py", "combination", "pyo", "ぴょ", "ピョ"),
  ]},
];

// Convertit le format raw en KanaGroup
function toGroups(raw: typeof basicRaw): KanaGroup[] {
  return raw.map(({ id, labelKey, pairs }) => ({
    id,
    labelKey,
    hiragana: pairs.map((p) => p.h),
    katakana: pairs.map((p) => p.k),
  }));
}

export const kanaGroups = {
  basic: toGroups(basicRaw),
  dakuten: toGroups(dakutenRaw),
  combinations: toGroups(combinationsRaw),
};

export const allKanas: Kana[] = [
  ...kanaGroups.basic.flatMap((g) => [...g.hiragana, ...g.katakana]),
  ...kanaGroups.dakuten.flatMap((g) => [...g.hiragana, ...g.katakana]),
  ...kanaGroups.combinations.flatMap((g) => [...g.hiragana, ...g.katakana]),
];

export const getKanaById = (id: string): Kana | undefined =>
  allKanas.find((k) => k.id === id);