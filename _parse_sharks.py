# Parse INDICE.docx text -> sharks.json
import json, re, os

def parse_sharks(src: str) -> list[dict]:
    with open(src, encoding='utf-8') as f:
        lines = [l.rstrip('\n') for l in f]

    # Latin binomial: genus is pure ASCII a-z; epithet allows accents and uppercase
    BINOMIAL    = re.compile(r'^([A-Z][a-z]{3,})\s+([A-Za-záéíóúüñ]{3,}[-A-Za-záéíóúüñ]*)$')
    ORDER_RE    = re.compile(r'^Orden ([A-Z][a-zA-Z]+)', re.IGNORECASE)
    FAMILY_RE   = re.compile(r'^Familia ([A-Z][a-zA-Z]+)', re.IGNORECASE)
    SIZE_PAT    = re.compile(r'\d+.*?cm', re.IGNORECASE)
    DIET_PAT    = re.compile(
        r'(Se alimenta|Prefiere |Su alimentaci|Su dieta|se alimenta principalmente'
        r'|se alimenta de|come principalmente|Se nutre|come )',
        re.IGNORECASE,
    )
    REPRO_START = (
        'viviparo', 'oviparo', 'su reproducci', 'reproducci',
        'la reproducci', 'las hembras', 'no se conocen camadas',
        'aun no se conoce', 'se reproduce', 'son ovip', 'son vivip',
        'pare ', 'la gestacion', 'los huevos', 'las capsulas',
        'su ciclo reproductivo', 'pone huevos',
    )
    SKIP_START  = ('sin fotografia', 'foto no disponible')
    STOP_WORDS  = ('diccionario', 'bibliograf')
    SKIP_GENUS  = {'orden', 'familia', 'genero', 'palabras', 'indice',
                   'avances', 'compromiso', 'primera', 'impreso',
                   'diseno', 'isbn', 'copyright'}

    def normalize(s: str) -> str:
        return (s.lower()
                .replace('á','a').replace('é','e').replace('í','i')
                .replace('ó','o').replace('ú','u').replace('ü','u').replace('ñ','n'))

    def is_repro(s: str) -> bool:
        n = normalize(s)
        return any(n.startswith(m) for m in REPRO_START)

    def is_skip(s: str) -> bool:
        n = normalize(s.lower())
        return any(n.startswith(m) for m in SKIP_START) and SIZE_PAT.search(s) is None

    def is_stop(s: str) -> bool:
        # Ignore TOC entries (have '…', 'Página', or are very long)
        if '…' in s or 'Página' in s or len(s) > 60:
            return False
        n = normalize(s.strip())
        return any(n.startswith(m) for m in STOP_WORDS)

    def is_taxonomy_header(s: str) -> bool:
        return bool(ORDER_RE.match(s) or FAMILY_RE.match(s) or s.startswith('Género '))

    def split_diet(text: str):
        m = DIET_PAT.search(text)
        if not m:
            return text.strip(), ''
        return text[:m.start()].strip(), text[m.start():].strip()

    current_order  = ''
    current_family = ''
    sharks: list[dict] = []
    i = 0
    n = len(lines)

    while i < n:
        line = lines[i]

        if is_stop(line):
            break
        if is_taxonomy_header(line):
            m = ORDER_RE.match(line)
            if m:
                current_order = m.group(1).capitalize()
            m = FAMILY_RE.match(line)
            if m:
                current_family = m.group(1)
            i += 1
            continue
        if is_skip(line):
            i += 1
            continue

        m = BINOMIAL.match(line)
        if not m:
            i += 1
            continue

        genus = m.group(1)
        # Filter out common false-positive words
        if normalize(genus) in SKIP_GENUS:
            i += 1
            continue

        sci_name = line.strip()

        # ── Look-ahead: scan for size line (cm), accumulate common name ────────
        # Common names can span multiple lines and may be prefixed with "Sin fotografía documentada"
        FOTO_PREFIX = re.compile(r'^(Sin fotograf[^a-z]*a documentada)+', re.IGNORECASE)

        def clean_foto(s: str) -> str:
            return FOTO_PREFIX.sub('', s).strip()

        j = i + 1
        # Skip blank lines only (not "sin fotografía" — those may embed the common name)
        while j < n and not lines[j].strip():
            j += 1
        if j >= n:
            i += 1; continue

        first_line = lines[j].strip()
        if is_stop(first_line) or is_taxonomy_header(first_line):
            i += 1; continue

        # Scan up to 6 non-blank lines to find the size line
        common_parts: list[str] = []
        k = j
        size_found = False
        for _ in range(6):
            if k >= n:
                break
            l_k = lines[k].strip()
            if not l_k:
                k += 1; continue
            if is_stop(l_k) or is_taxonomy_header(l_k):
                break
            # Strip "Sin fotografía" prefix
            cleaned = clean_foto(l_k)
            if SIZE_PAT.search(cleaned):
                tamano = cleaned
                k += 1
                size_found = True
                break
            # If cleaned is non-empty, it's part of the common name
            if cleaned:
                common_parts.append(cleaned)
            k += 1

        if not size_found:
            i += 1; continue

        common_name = ' '.join(common_parts) if common_parts else ''

        # Snapshot taxonomy state NOW, before inner loop may advance current_family/order
        entry_order  = current_order
        entry_family = current_family

        # ── Collect content paragraphs ───────────────────────────────────────
        ptr = k  # k already points one past the size line
        while ptr < n and (not lines[ptr].strip() or is_skip(lines[ptr])):
            ptr += 1

        paragraphs: list[str] = []
        while ptr < n:
            l = lines[ptr].strip()

            if is_stop(l):
                break
            if is_taxonomy_header(l):
                m2 = ORDER_RE.match(l)
                if m2: current_order = m2.group(1).capitalize()
                m2 = FAMILY_RE.match(l)
                if m2: current_family = m2.group(1)
                ptr += 1; continue
            if BINOMIAL.match(l) and normalize(l.split()[0]) not in SKIP_GENUS:
                break  # start of next species
            if is_skip(l):
                ptr += 1; continue
            if not l:
                ptr += 1; continue

            # Dropcap: single letter on its own line
            if len(l) == 1 and l.isalpha():
                ptr += 1
                while ptr < n and (not lines[ptr].strip() or is_skip(lines[ptr])):
                    ptr += 1
                if ptr < n and lines[ptr].strip():
                    combined = l + lines[ptr].strip()
                    paragraphs.append(combined)
                    ptr += 1
                continue

            paragraphs.append(l)
            ptr += 1

        # ── Classify paragraphs into fields ─────────────────────────────────
        body = [p for p in paragraphs if p]

        # Find the reproduction paragraph (last one matching repro pattern)
        repro_idx = None
        for idx in range(len(body) - 1, -1, -1):
            if is_repro(body[idx]):
                repro_idx = idx
                break

        reproduccion = ''
        if repro_idx is not None:
            reproduccion = body[repro_idx]
            body = [p for idx, p in enumerate(body) if idx != repro_idx]

        descripcion = body[0] if body else ''
        habitat     = ''
        dieta       = ''
        if len(body) > 1:
            ecology = ' '.join(body[1:])
            habitat, dieta = split_diet(ecology)

        sharks.append({
            'nombre_comun'    : common_name,
            'nombre_cientifico': sci_name,
            'orden'           : entry_order,
            'familia'         : entry_family,
            'genero'          : genus,
            'tamano'          : tamano,
            'habitat'         : habitat,
            'dieta'           : dieta,
            'reproduccion'    : reproduccion,
            'descripcion'     : descripcion,
        })

        i = ptr

    return sharks


if __name__ == '__main__':
    import sys
    sys.stdout.reconfigure(encoding='utf-8')

    sharks = parse_sharks('_indice_raw.txt')
    print(f'Parsed {len(sharks)} species')

    for s in sharks[:3]:
        print(f"\n  {s['nombre_cientifico']} | {s['nombre_comun']} | {s['tamano']}")
        print(f"  desc:  {s['descripcion'][:90]}...")
        print(f"  hab:   {s['habitat'][:90]}...")
        print(f"  dieta: {s['dieta'][:90]}...")
        print(f"  repro: {s['reproduccion'][:90]}...")

    # Spot-check: show any entry with empty descripcion
    empty = [s['nombre_cientifico'] for s in sharks if not s['descripcion']]
    print(f'\nEmpty descripcion: {len(empty)} -> {empty[:5]}')

    os.makedirs('lib', exist_ok=True)
    out_path = os.path.join('lib', 'sharks.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(sharks, f, ensure_ascii=False, indent=2)
    print(f'\nSaved {len(sharks)} species to {out_path}')
