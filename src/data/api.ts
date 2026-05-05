import type { StudentDashboard, Student, StudentSkills, TestEntry } from './types';

const API_BASE = 'https://script.google.com/macros/s/AKfycbwi4HPMvOeqGtx0qt1zqsRQuak3fzM6x2ry_h9xx4x0qE7dxx6KC6iVWIMnzNgCNOST/exec';

export async function fetchStudentList(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}?sheet=${encodeURIComponent('Página Principal')}`, { redirect: 'follow' });
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const students: any[] = [];
    data.forEach((row: any) => {
      const todasAsCelulas = Object.values(row).map(v => String(v).trim());
      todasAsCelulas.forEach(val => {
        const v = val.toLowerCase();
        const termosProibidos = [
          "congregação", "lista de presença", "página", "principal", "g.e.m", "gem",
          "controle progressivo", "geral", "instrumento", "hinos", "msa", "fase",
          "método", "teste", "oficial", "data", "local", "assinatura", "presença",
          "total", "falta", "planejamento", "teórico", "aluno", "ver aluno"
        ];
        const temNumero = /\d/.test(val);
        const temPonto = val.includes('.');
        if (
          val.length >= 3 &&
          !temNumero &&
          !temPonto &&
          !termosProibidos.some(t => v.includes(t)) &&
          /^[A-Z]/.test(val)
        ) {
          if (!students.find(s => s.name === val)) {
            students.push({ name: val, sheetName: val });
          }
        }
      });
    });
    return students;
  } catch (err) {
    console.error("Erro na filtragem:", err);
    return [];
  }
}

export async function fetchStudentDashboard(sheetName: string): Promise<any> {
  try {
    const [resAluno, resPresenca, resNotas] = await Promise.all([
      fetch(`${API_BASE}?sheet=${encodeURIComponent(sheetName)}`, { redirect: 'follow' }),
      fetch(`${API_BASE}?sheet=${encodeURIComponent('Lista de Presença 2026')}`, { redirect: 'follow' }),
      fetch(`${API_BASE}?sheet=${encodeURIComponent('Notas')}`, { redirect: 'follow' })
    ]);

    const rows = await resAluno.json();
    const rowsPresenca = await resPresenca.json();
    const rowsNotas = await resNotas.json();

    // ─── FREQUÊNCIA ───────────────────────────────────────────────
    let frequenciaPct = "0%";
    let frequenciaDetalhe = "0 aulas";
    if (Array.isArray(rowsPresenca)) {
      const reg = rowsPresenca.find(row =>
        Object.values(row).some(v => String(v).trim().toLowerCase() === sheetName.trim().toLowerCase())
      );
      if (reg) {
        const rawFreq = reg['col_49'];
        if (rawFreq) {
          const num = parseFloat(String(rawFreq).replace(',', '.'));
          frequenciaPct = (!isNaN(num) && num <= 1 && num > 0)
            ? `${Math.round(num * 100)}%`
            : (String(rawFreq).includes('%') ? String(rawFreq) : `${rawFreq}%`);
        }
        frequenciaDetalhe = `${reg['col_47'] || '44'} aulas`;
      }
    }

    if (!Array.isArray(rows) || rows.length === 0) return null;

    // ─── MATRIX ───────────────────────────────────────────────────
    const rawRows = rows;
    const matrix: string[][] = rows.map((row: any) =>
      Object.values(row).map(v => String(v || "").trim())
    );

    const getNumericFromKey = (rowIdx: number, key: string): number => {
      const row = rawRows[rowIdx];
      if (!row) return 0;
      const val = row[key];
      if (val === undefined || val === null || val === '') return 0;
      const n = parseFloat(String(val).replace(',', '.'));
      if (isNaN(n)) return 0;
      return n;
    };

    // ─── PROGRESSO DE HINOS ──────────────────────────────────────
    let progressoJovens = 0;
    let progressoOficiais = 0;
    let hinosJovensOk = 0;
    let hinosOficiaisOk = 0;

    let contagemTabelasHinos = 0;

    for (let r = 0; r < rawRows.length; r++) {
      const rowText = Object.values(rawRows[r]).map(v => String(v).trim().toLowerCase());
      
      if (rowText.includes('progresso %')) {
        contagemTabelasHinos++;
        const nextRow = rawRows[r + 1];
        if (!nextRow) continue;

        let colKeyProgresso = 'col_15';
        let colKeyTotal = 'col_0';

        for (const [key, val] of Object.entries(rawRows[r])) {
          const str = String(val).trim().toLowerCase();
          if (str === 'progresso %') colKeyProgresso = key;
          if (str.includes('hinos passados')) colKeyTotal = key;
        }

        const rawProgresso = getNumericFromKey(r + 1, colKeyProgresso);
        const valProgresso = (rawProgresso <= 1 && rawProgresso > 0) 
          ? Math.round(rawProgresso * 1000) / 10 
          : rawProgresso;

        const valTotal = getNumericFromKey(r + 1, colKeyTotal);

        if (contagemTabelasHinos === 1) {
          progressoJovens = valProgresso;
          hinosJovensOk = Math.round(valTotal);
        } else if (contagemTabelasHinos === 2) {
          progressoOficiais = valProgresso;
          hinosOficiaisOk = Math.round(valTotal);
        }
      }
    }

    const extractFromRow = (linha: string[], labels: string[]): string => {
      for (let c = 0; c < linha.length; c++) {
        const cellLower = linha[c].toLowerCase();
        for (const label of labels) {
          if (cellLower.includes(label.toLowerCase())) {
            const inline = linha[c].replace(new RegExp(label + '[:\\-\\s]*', 'i'), '').trim();
            if (inline.length > 0) return inline;
            for (let cc = c + 1; cc < Math.min(c + 8, linha.length); cc++) {
              const next = linha[cc].trim();
              if (next.length > 0) return next;
            }
          }
        }
      }
      return '';
    };

    // ─── FALLBACK LINHA 3 ─────────────────────────────────────────
    const linha3 = matrix[2] ?? [];
    const instrLinha3    = extractFromRow(linha3, ['Instrumento']);
    const comunLinha3    = extractFromRow(linha3, ['Comum', 'Congregação', 'Congregacao']);
    const ingressoLinha3 = extractFromRow(linha3, ['Ingresso', 'Início', 'Inicio']);

    let dashboardStartRow = 0;
    for (let r = 0; r < matrix.length; r++) {
      if (matrix[r].join(' ').toLowerCase().includes('dados para dashboard')) {
        dashboardStartRow = r + 1;
        break;
      }
    }

    const dashCells: string[] = matrix
      .slice(dashboardStartRow)
      .flat()
      .filter(c => c.length > 0);

    const extractField = (labels: string[]): string => {
      for (const cell of dashCells) {
        const cellLower = cell.toLowerCase();
        for (const label of labels) {
          if (cellLower.includes(label.toLowerCase())) {
            const cleaned = cell
              .replace(new RegExp(label + '[:\\-\\s]*', 'i'), '')
              .trim();
            if (cleaned.length > 0) return cleaned;
          }
        }
      }
      return '';
    };

    // ─── CAMPOS BÁSICOS DO ALUNO ──────────────────────────────────
    const ingressoRaw = extractField(['Ingresso', 'Início', 'Inicio', 'Data de início', 'Data inicio']) || ingressoLinha3;
    const idadeRaw    = extractField(['Idade']);
    const instrRaw    = extractField(['Instrumento']) || instrLinha3;
    const comunRaw    = extractField(['Comum', 'Congregação', 'Congregacao']) || comunLinha3;
    const batismoRaw  = extractField(['Batizado', 'Batismo', 'Batizad']);
    const testeRaw    = extractField(['Teste Reunião de Jovens', 'Teste Reuniao', 'Reunião de Jovens', 'Reuniao de Jovens', 'Teste']);

    let dataFinal = new Date().toISOString().split('T')[0];
    for (const s of [ingressoRaw, ingressoLinha3]) {
      const matchD = s.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (matchD) { dataFinal = `${matchD[3]}-${matchD[2]}-${matchD[1]}`; break; }
    }

    // ─── SKILLS ───────────────────────────────────────────────────
    const findSkillValue = (label: string): number => {
      const lbl = label.toLowerCase();
      const dashRows = rawRows.slice(dashboardStartRow);
      for (const row of dashRows) {
        const entries = Object.entries(row);
        for (let i = 0; i < entries.length; i++) {
          const [, val] = entries[i];
          if (String(val).toLowerCase().includes(lbl)) {
            for (let j = i + 1; j < Math.min(i + 6, entries.length); j++) {
              const n = parseFloat(String(entries[j][1]).replace(',', '.'));
              if (!isNaN(n) && n !== 0) {
                return n <= 1 && n > 0 ? Math.round(n * 100) : Math.round(n);
              }
            }
          }
        }
      }
      return 0;
    };

    const s_pratica  = findSkillValue('Prática de Instrumento');
    const s_ritmica  = findSkillValue('Percepção Rítmica');
    const s_metrica  = findSkillValue('Leitura Métrica');
    const s_afinacao = findSkillValue('Afinação');

    const somaTotal = s_pratica + s_ritmica + s_metrica + s_afinacao;
    let nivelTexto = "Iniciante";
    let progressoBarra = 0;
    if      (somaTotal <= 100) { nivelTexto = "Iniciante";     progressoBarra = somaTotal; }
    else if (somaTotal <= 200) { nivelTexto = "Aprendiz";      progressoBarra = somaTotal - 100; }
    else if (somaTotal <= 300) { nivelTexto = "Intermediário"; progressoBarra = somaTotal - 200; }
    else                       { nivelTexto = "Avançado";      progressoBarra = Math.min(somaTotal - 300, 100); }

    const extractLongText = (label: string): string => {
      const lbl = label.toLowerCase();
      for (const cell of dashCells) {
        if (cell.toLowerCase().includes(lbl) && cell.length > label.length + 5) {
          return cell.replace(new RegExp(label + '[:\\s]*', 'i'), '').trim();
        }
      }
      return '';
    };

    const pontosFortesRaw  = extractLongText('Pontos Fortes');
    const pontosAtencaoRaw = extractLongText('Pontos de atenção') || extractLongText('Pontos de Atencao');

    // ─── HINOS PARA ESTUDO (ISOLADO COM TRAVA DE SEGURANÇA) ───────
    const ESTUD_VARIANTS = ['estud.', 'estudar', 'estud'];
    const hinosJovensEstudo: string[] = [];
    const hinosOficiaisEstudo: string[] = [];
    let contextoHinos: 'jovens' | 'oficiais' | null = null;

    matrix.forEach((linha) => {
      const textoLinha = linha.join(' ').toLowerCase();
      
      if (textoLinha.includes('jovens e menores') || textoLinha.includes('teste para reuniões')) {
        contextoHinos = 'jovens';
      } else if (textoLinha.includes('culto oficial') || textoLinha.includes('hinos oficiais')) {
        contextoHinos = 'oficiais';
      } else if (textoLinha.includes('método do instrumento') || textoLinha.includes('msa') || textoLinha.includes('dados para dashboard')) {
        contextoHinos = null; 
      }

      if (contextoHinos) {
        linha.forEach((cel, idx) => {
          const celLower = cel.toLowerCase().trim();
          if (ESTUD_VARIANTS.includes(celLower)) {
            const candidates = [idx - 1, idx - 2, idx + 1, idx + 2].filter(i => i >= 0 && i < linha.length);
            for (const ci of candidates) {
              const v = linha[ci].trim();
              if (v && !isNaN(Number(v)) && Number(v) > 0) {
                if (contextoHinos === 'jovens' && !hinosJovensEstudo.includes(v)) hinosJovensEstudo.push(v);
                if (contextoHinos === 'oficiais' && !hinosOficiaisEstudo.includes(v)) hinosOficiaisEstudo.push(v);
                break;
              }
            }
          }
        });
      }
    });

    // ─── MÉTODOS DO INSTRUMENTO (ISOLADO COM TRAVA DE SEGURANÇA) ──
    const licoesPorMetodo: { [key: string]: string[] } = {};
    let currentContextMethod = '';
    let isInMethodsArea = false;

    for (let r = 0; r < Math.min(dashboardStartRow, rawRows.length); r++) {
      const row = rawRows[r];
      const entries = Object.entries(row);
      const rowText = entries.map(e => String(e[1]).toLowerCase()).join(' ');

      if (rowText.includes('método do instrumento') || rowText.includes('métodos complementares')) {
        isInMethodsArea = true;
      } else if (rowText.includes('msa') || rowText.includes('dados para dashboard') || rowText.includes('hinos')) {
        isInMethodsArea = false;
        currentContextMethod = ''; 
      }

      if (!isInMethodsArea) continue;

      const isMethodRow = /(schmoll|coutinho|sacro|suzuki|sitt|laoureux)/i.test(rowText);
      
      if (isMethodRow) {
        for (let i = 0; i < entries.length; i++) {
          const cellVal = String(entries[i][1]).toLowerCase().trim();
          if (cellVal === 'true' || cellVal === '✓' || cellVal === '✔️' || cellVal === '☑') {
            for (let j = i + 1; j < Math.min(i + 3, entries.length); j++) {
              const nome = String(entries[j][1]).trim();
              if (nome.length > 2 && nome.toLowerCase() !== 'true' && nome !== '') {
                currentContextMethod = nome;
                if (!licoesPorMetodo[currentContextMethod]) {
                  licoesPorMetodo[currentContextMethod] = [];
                }
                break;
              }
            }
          }
        }
      }

      if (!currentContextMethod) {
        if (rowText.includes('schmoll')) { currentContextMethod = 'A. Schmoll'; licoesPorMetodo[currentContextMethod] = licoesPorMetodo[currentContextMethod] || []; }
        else if (rowText.includes('coutinho') || rowText.includes('sacro')) { currentContextMethod = 'W. Coutinho'; licoesPorMetodo[currentContextMethod] = licoesPorMetodo[currentContextMethod] || []; }
      }

      if (currentContextMethod) {
        for (let i = 0; i < entries.length; i++) {
          const statusVal = String(entries[i][1]).toLowerCase().trim();
          if (ESTUD_VARIANTS.includes(statusVal)) {
            if (i > 0) {
              const numVal = String(entries[i - 1][1]).trim();
              if (numVal && !isNaN(Number(numVal)) && Number(numVal) > 0) {
                if (!licoesPorMetodo[currentContextMethod].includes(numVal)) {
                  licoesPorMetodo[currentContextMethod].push(numVal);
                }
              }
            }
          }
        }
      }
    }

    const metodosStrings = Object.entries(licoesPorMetodo)
      .filter(([_, licoes]) => licoes.length > 0)
      .map(([m, l]) => `${m}: ${l.join(', ')}`);

    // ─── MSA CABEÇALHO ────────────────────────────────────────────
    let msaFaseCabecalho = '';
    let msaAtividadeCabecalho = '';

    for (let r = 0; r < matrix.length; r++) {
      const row = rawRows[r];
      const entries = Object.entries(row);
      for (let i = 0; i < entries.length; i++) {
        const cellText = String(entries[i][1]).trim();
        if (cellText.toLowerCase().includes('fase atual')) {
          const limpo = cellText.replace(/fase atual:?/i, '').trim();
          if (limpo) {
            msaFaseCabecalho = limpo;
            for (let j = i + 1; j < entries.length; j++) {
              const next = String(entries[j][1]).trim();
              if (next) { msaAtividadeCabecalho = next; break; }
            }
          } else {
            let faseEncontrada = false;
            for (let j = i + 1; j < entries.length; j++) {
              const next = String(entries[j][1]).trim();
              if (next && !faseEncontrada) {
                msaFaseCabecalho = next;
                faseEncontrada = true;
              } else if (next && faseEncontrada) {
                msaAtividadeCabecalho = next;
                break;
              }
            }
          }
          break;
        }
      }
      if (msaFaseCabecalho) break;
    }

    // ─── MSA FALLBACK ─────────────────────────────────────────────
    let faseAtualMSA = '0ª Fase';
    const fasePattern = /fase\s+(\d+)/i;
    let ultimaFaseComMarca = 0;

    for (let r = 56; r < Math.min(162, matrix.length); r++) {
      const textoLinha = matrix[r].join(' ');
      const matchFase = textoLinha.match(fasePattern);
      if (matchFase) {
        const numFase = parseInt(matchFase[1]);
        for (let rr = r + 1; rr < Math.min(r + 20, matrix.length); rr++) {
          if (matrix[rr].some(c => c.toLowerCase() === 'true')) {
            if (numFase > ultimaFaseComMarca) ultimaFaseComMarca = numFase;
            break;
          }
          if (matrix[rr].join(' ').match(fasePattern)) break;
        }
      }
    }
    if (ultimaFaseComMarca > 0) faseAtualMSA = `${ultimaFaseComMarca}ª Fase`;

    // ─── NOTAS DE TEORIA ──────────────────────────────────────────
    let notasTeoriaString = '';
    if (Array.isArray(rowsNotas)) {
      const notasEncontradas: string[] = [];
      let currentFase = '';
      let studentColIdx = -1;

      for (let r = 0; r < rowsNotas.length; r++) {
        const rowArr = Object.values(rowsNotas[r]).map(v => String(v || '').trim());
        const textLine = rowArr.join(' ').toUpperCase();

        if (textLine.includes('FASE')) {
          const faseMatch = textLine.match(/FASE\s\d+/);
          if (faseMatch) {
            const rawFase = faseMatch[0];
            currentFase = rawFase.charAt(0) + rawFase.slice(1).toLowerCase();
          }
        }

        const firstCell = rowArr[0]?.toUpperCase() || '';
        if (firstCell.includes('NOME')) {
          studentColIdx = rowArr.findIndex(c => {
            const cellName = c.toLowerCase();
            return cellName.length >= 3 && sheetName.toLowerCase().includes(cellName);
          });
        }

        if (firstCell.includes('NOTA') && studentColIdx !== -1) {
          let nota = rowArr[studentColIdx];
          if (nota && nota !== '-' && nota !== '') {
            const dateMatch = nota.match(/^\d{4}-(\d{2})-(\d{2})T/);
            if (dateMatch) {
              nota = `${parseInt(dateMatch[2], 10)},${parseInt(dateMatch[1], 10)}`;
            }
            notasEncontradas.push(`${currentFase || 'Avaliação'}: ${nota}`);
          }
          studentColIdx = -1;
        }
      }
      notasTeoriaString = notasEncontradas.length > 0 ? notasEncontradas.join(' | ') : '';
    }

    // ─── DETECÇÃO DINÂMICA DE VOZES (ROBUSTA) ───────────────────────
    const detectedVoices = new Set<string>();
    const possibleVoices = ['soprano', 'contralto', 'tenor', 'baixo'];

    // 🟢 Junta as 12 primeiras linhas (onde ficam as instruções da linha 6 e os cabeçalhos da linha 7)
    // Isso é perfeito porque ignora a linha 19 lá embaixo ("Faltam no Contralto")
    const topRowsText = matrix.slice(0, 12).map(row => row.join(' ').toLowerCase()).join(' ');

    possibleVoices.forEach(voz => {
      // Usa regex com \b para pegar a palavra exata no meio da frase
      if (new RegExp(`\\b${voz}\\b`).test(topRowsText)) {
        detectedVoices.add(voz.charAt(0).toUpperCase() + voz.slice(1));
      }
    });

    let voicesString = "Soprano e Contralto"; // Padrão
    const orderedVoices: string[] = [];
    
    if (detectedVoices.has('Soprano')) orderedVoices.push('Soprano');
    if (detectedVoices.has('Contralto')) orderedVoices.push('Contralto');
    if (detectedVoices.has('Tenor')) orderedVoices.push('Tenor');
    if (detectedVoices.has('Baixo')) orderedVoices.push('Baixo');

    if (orderedVoices.length > 0) {
      if (orderedVoices.length === 1) {
        voicesString = orderedVoices[0]; 
      } else if (orderedVoices.length === 2) {
        voicesString = `${orderedVoices[0]} e ${orderedVoices[1]}`; 
      } else {
        voicesString = orderedVoices.slice(0, -1).join(', ') + ' e ' + orderedVoices[orderedVoices.length - 1]; 
      }
    }

    // ─── TESTES ───────────────────────────────────────────────────
    let testEntriesArr: any[] = [];
    if (testeRaw) {
      const dateMatch = testeRaw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
        const formattedDate = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T12:00:00Z`;
        testEntriesArr.push({
          id: 't1',
          description: 'Teste para Reunião de Jovens',
          testDate: formattedDate
        });
      } else {
        testEntriesArr.push({
          id: 't1',
          description: testeRaw,
          testDate: new Date().toISOString()
        });
      }
    }

    // ─── TEORIA FINAL ─────────────────────────────────────────────
    let teoriaFinal = [msaFaseCabecalho, msaAtividadeCabecalho].filter(Boolean).join(' | ');
    if (!teoriaFinal) teoriaFinal = testeRaw || faseAtualMSA || 'Revisar fase atual';

    // ─── DESAFIOS DA SEMANA ───────────────────────────────────────
    const weeklyChallenges = {
      hinos: [
        hinosJovensEstudo.length > 0 ? `Jovens: ${hinosJovensEstudo.join(', ')}` : null,
        hinosOficiaisEstudo.length > 0 ? `Oficiais: ${hinosOficiaisEstudo.join(', ')}` : null,
      ].filter(Boolean).join(' | ') || 'Nenhum marcado',
      
      metodo: metodosStrings.length > 0 ? metodosStrings.join(' | ') : 'Consultar instrutor',
      
      teoria: teoriaFinal
    };

    // ─── RETORNO FINAL ────────────────────────────────────────────
    return {
      student: {
        id: sheetName,
        fullName: sheetName,
        instrument: instrRaw || instrLinha3 || 'Violino',
        level: nivelTexto,
        xp: Number(progressoBarra) || 0,
        startDate: dataFinal,
        age: parseInt(idadeRaw.match(/\d+/)?.[0] || '0'),
        congregation: comunRaw || comunLinha3 || 'G.E.M',
        frequency: frequenciaPct,
        attendanceDetail: frequenciaDetalhe,
        baptized: batismoRaw.toLowerCase().includes('sim'),
        baptismDate: batismoRaw.match(/(\d{2}\/\d{2}\/\d{4})/)?.[0] || null
      },
      skills: {
        studentId: sheetName,
        rhythmicPerception: s_ritmica,
        instrumentPractice: s_pratica,
        tuning: s_afinacao,
        metricReading: s_metrica
      },
      traits: {
        studentId: sheetName,
        traits: ['Ativo'],
        strengths: pontosFortesRaw || 'Em evolução',
        criticalDifficulties: pontosAtencaoRaw || 'Nenhuma ressalva.',
        theoreticalGrades: notasTeoriaString
      },
      hymnsData: {
        jovens:   { concluido: hinosJovensOk,   total: 100, progresso: progressoJovens },
        oficiais: { concluido: hinosOficiaisOk, total: 380, progresso: progressoOficiais },
        voices: voicesString 
      },
      weeklyChallenges,
      lessonHistory: [],
      testEntries: testEntriesArr
    };

  } catch (err) {
    console.error("Erro fatal:", err);
    return null;
  }
}