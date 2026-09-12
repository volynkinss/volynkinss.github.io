"""Verify the text of both tracked PDF resumes against resume-data.mjs.

Requires Python with pypdf and Node 18+. Set NODE_BIN if node is not on PATH.
This is an extraction check, not a test against an employer's ATS.
"""
import json
import os
from pathlib import Path
import re
import subprocess
import unicodedata
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = Path(os.environ.get('CV_PDF_DIR', ROOT / 'downloads'))
source = json.loads(subprocess.check_output(
    [os.environ.get('NODE_BIN', 'node'), '--input-type=module', '-e',
     "import { resume } from './resume-data.mjs'; console.log(JSON.stringify(resume));"],
    cwd=ROOT, text=True,
))


def compact(value):
    # Whitespace varies by PDF extractor. Keep letters, numbers and punctuation.
    return re.sub(r'\s+', '', unicodedata.normalize('NFKC', value)).replace('\u00ad', '').casefold()


def record_values(record, fields):
    for field in fields:
        value = record.get(field)
        if isinstance(value, str) and value:
            yield field, value
        elif isinstance(value, list):
            for i, item in enumerate(value):
                if isinstance(item, str):
                    yield f'{field}[{i}]', item


def expected_values(page):
    yield from record_values(page, ['name', 'headline', 'location', 'summary', 'availability', 'languages'])
    for c in page['contacts']:
        yield 'contact', c['value']
    yield from record_values(page['employment'], ['company', 'role', 'period', 'department', 'overview', 'automation'])
    for case in page['employment']['cases']:
        yield from record_values(case, ['title', 'subtitle', 'status', 'bullets', 'stack'])
    yield 'projectIntro', page['projectIntro']
    for p in page['projects']:
        yield from record_values(p, ['title', 'role', 'category', 'contribution', 'period', 'status', 'description', 'bullets', 'stack'])
    for p in page['otherProjects']:
        yield from record_values(p, ['title', 'period', 'status', 'description', 'stack'])
    for s in page['skills']:
        yield from record_values(s, ['title', 'description', 'items'])
    yield from record_values(page['background'], ['company', 'role', 'period', 'description'])
    yield from record_values(page['education'], ['institution', 'degree', 'year'])


for lang in ['ru', 'en']:
    page = source[lang]
    reader = PdfReader(PDF_DIR / f'Sergey_Volynkin_CV_{lang.upper()}.pdf')
    pages = [p.extract_text() or '' for p in reader.pages]
    text = '\n'.join(pages)
    clean = compact(text)
    assert 2 <= len(pages) <= 4, f'{lang}: unexpected page count {len(pages)}'
    assert all(len(p.strip()) > 100 for p in pages), f'{lang}: blank or nearly blank PDF page'
    values = list(expected_values(page))
    missing = [(field, value) for field, value in values if compact(value) not in clean]
    assert not missing, f'{lang}: missing or reordered text {missing}'
    assert clean.count(compact(page['summary'])) == 1, f'{lang}: duplicate professional summary'
    opposite = source['en' if lang == 'ru' else 'ru']
    assert compact(opposite['name']) not in clean, f'{lang}: mixed resume languages'
    if lang == 'en':
        assert not re.search('[А-Яа-яЁё]', text), 'English PDF contains Russian text'
    # Employer, actual role and dates must precede their corresponding descriptions.
    for record in [page['employment'], page['background']]:
        fields = ['company', 'role', 'period']
        offsets = [clean.index(compact(record[k])) for k in fields]
        assert offsets == sorted(offsets), f'{lang}: chronology order incorrect: {fields}'
    assert clean.index(compact(page['employment']['company'])) < clean.index(compact(page['background']['company']))
    # Each contact needs a real line boundary; the previous flex layout glued values together.
    for contact in page['contacts']:
        line = next((line for line in text.splitlines() if compact(contact['value']) in compact(line)), None)
        assert line is not None, f'{lang}: contact split across lines: {contact["value"]}'
        for other in page['contacts']:
            if other != contact:
                assert compact(other['value']) not in compact(line), f'{lang}: contacts merged into one line'
    out = os.environ.get('CV_QA_DIR')
    if out:
        Path(out).mkdir(parents=True, exist_ok=True)
        Path(out, f'after-{lang.upper()}.txt').write_text(text)
    print(f'{lang}: {len(pages)} pages, {len(values)} source values preserved, contacts separated, chronology and language verified')
