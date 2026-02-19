/** Одна форма глагола: базовая (V1), Past simple (V2), Past participle (V3), перевод */
export interface IrregularVerb {
  v1: string;
  v2: string;
  v3: string;
  ru: string;
}

/** Коллекция таблицы 1 — неправильные глаголы из учебника */
export const irregularVerbsTable1: IrregularVerb[] = [
  { v1: "be", v2: "was/were", v3: "been", ru: "быть" },
  { v1: "beat", v2: "beat", v3: "beaten", ru: "бить" },
  { v1: "become", v2: "became", v3: "become", ru: "становиться" },
  { v1: "begin", v2: "began", v3: "begun", ru: "начинать" },
  { v1: "bite", v2: "bit", v3: "bitten", ru: "кусать" },
  { v1: "blow", v2: "blew", v3: "blown", ru: "дуть" },
  { v1: "break", v2: "broke", v3: "broken", ru: "ломать" },
  { v1: "bring", v2: "brought", v3: "brought", ru: "приносить" },
  { v1: "build", v2: "built", v3: "built", ru: "строить" },
  { v1: "burn", v2: "burned/burnt", v3: "burned/burnt", ru: "гореть, жечь" },
  { v1: "buy", v2: "bought", v3: "bought", ru: "покупать" },
  { v1: "catch", v2: "caught", v3: "caught", ru: "ловить" },
  { v1: "choose", v2: "chose", v3: "chosen", ru: "выбирать" },
  { v1: "come", v2: "came", v3: "come", ru: "приходить" },
  { v1: "cost", v2: "cost", v3: "cost", ru: "стоить" },
  { v1: "cut", v2: "cut", v3: "cut", ru: "резать" },
  { v1: "deal", v2: "dealt", v3: "dealt", ru: "иметь дело" },
  { v1: "do", v2: "did", v3: "done", ru: "делать" },
  { v1: "draw", v2: "drew", v3: "drawn", ru: "рисовать, тащить" },
  { v1: "dream", v2: "dreamed/dreamt", v3: "dreamed/dreamt", ru: "мечтать" },
  { v1: "drink", v2: "drank", v3: "drunk", ru: "пить" },
  { v1: "drive", v2: "drove", v3: "driven", ru: "водить (машину)" },
  { v1: "eat", v2: "ate", v3: "eaten", ru: "есть" },
  { v1: "fall", v2: "fell", v3: "fallen", ru: "падать" },
  { v1: "feel", v2: "felt", v3: "felt", ru: "чувствовать" },
  { v1: "fight", v2: "fought", v3: "fought", ru: "драться, сражаться" },
  { v1: "find", v2: "found", v3: "found", ru: "находить" },
  { v1: "fly", v2: "flew", v3: "flown", ru: "летать" },
  { v1: "forget", v2: "forgot", v3: "forgotten", ru: "забывать" },
  { v1: "forgive", v2: "forgave", v3: "forgiven", ru: "прощать" },
  { v1: "freeze", v2: "froze", v3: "frozen", ru: "замерзать" },
  { v1: "get", v2: "got", v3: "got", ru: "получать, становиться" },
  { v1: "give", v2: "gave", v3: "given", ru: "давать" },
  { v1: "go", v2: "went", v3: "gone", ru: "идти, ехать" },
  { v1: "grow", v2: "grew", v3: "grown", ru: "расти, выращивать" },
  { v1: "hang", v2: "hung", v3: "hung", ru: "вешать, висеть" },
  { v1: "have", v2: "had", v3: "had", ru: "иметь" },
  { v1: "hear", v2: "heard", v3: "heard", ru: "слышать" },
  { v1: "hide", v2: "hid", v3: "hidden", ru: "прятать" },
  { v1: "hit", v2: "hit", v3: "hit", ru: "ударять" },
  { v1: "hold", v2: "held", v3: "held", ru: "держать" },
  { v1: "hurt", v2: "hurt", v3: "hurt", ru: "причинять боль, ушибить" },
  { v1: "keep", v2: "kept", v3: "kept", ru: "хранить, держать" },
  { v1: "know", v2: "knew", v3: "known", ru: "знать" },
  { v1: "learn", v2: "learned/learnt", v3: "learned/learnt", ru: "учить, узнавать" },
];
