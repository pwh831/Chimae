/*
 * 한국어 조사 처리.
 *
 * 앞말의 받침 유무에 따라 뒤에 붙는 말이 갈린다.
 * 화면마다 따로 두면 "준호이가" 같은 말이 슬그머니 생긴다.
 */

/** 마지막 글자에 받침이 있는지. 한글 음절이 아니면 없는 것으로 본다. */
export function hasFinalConsonant(word: string): boolean {
  const lastChar = word.at(-1)
  if (!lastChar) return false
  const code = lastChar.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

/** 주격 조사. 순자님 → "순자님이", 김치찌개 → "김치찌개가" */
export function subjectMarker(word: string): string {
  return hasFinalConsonant(word) ? '이' : '가'
}

/**
 * 이름에 붙는 친근한 주격. 지민 → "지민이가", 준호 → "준호가"
 * 받침이 있는 이름에는 접미사 '이'가 먼저 붙는다.
 */
export function nameSubject(name: string): string {
  return hasFinalConsonant(name) ? '이가' : '가'
}

/** 이름에 붙는 여격. 지민 → "지민이에게", 준호 → "준호에게" */
export function nameDative(name: string): string {
  return hasFinalConsonant(name) ? '이에게' : '에게'
}

/** 서술격. 국밥 → "국밥이에요", 김치찌개 → "김치찌개예요" */
export function copula(word: string): string {
  return hasFinalConsonant(word) ? '이에요' : '예요'
}
