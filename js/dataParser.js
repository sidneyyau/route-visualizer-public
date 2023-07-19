export const getTollVC = async () => {
  const result = [];
  const url = `https://assets.x.dev/REDACTED.xlsx`
  const data = await (await fetch(url)).arrayBuffer();
  const workbook = XLSX.read(data)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  var currentRow = 3
  while(sheet[`A${currentRow}`]) {
    result.push({
      WHC_TOLL: sheet['B' + currentRow].v,
      CHT_TOLL: sheet['C' + currentRow].v,
      EHC_TOLL: sheet['D' + currentRow].v,
      EHC_VC_SB: sheet['F' + currentRow].v,
      CHT_VC_SB: sheet['G' + currentRow].v,
      WHC_VC_SB: sheet['H' + currentRow].v,
      EHC_VC_NB: sheet['F' + currentRow].v, // Not available yet, to be edited later
      CHT_VC_NB: sheet['G' + currentRow].v, // Not available yet, to be edited later
      WHC_VC_NB: sheet['H' + currentRow].v, // Not available yet, to be edited later
      PHF: sheet['E' + currentRow].v
    })
    currentRow++
  }

  return result
}

export const getVCQueue = async () => {
  const result = { WHC_SB: [], CHT_SB: [], EHC_SB: [], WHC_NB: [], CHT_NB: [], EHC_NB: [] };
  const url = `https://assets.x.dev/REDACTED.xlsx`
  const data = await (await fetch(url)).arrayBuffer();
  const workbook = XLSX.read(data)
  const sheets = workbook.Sheets
  for (const sheet in sheets) {
    let currentRow = 3 // start from row 3
    const currentWorkingSheet = workbook.Sheets[sheet]
    if (sheet.includes('WHC')) {
      while (currentWorkingSheet['A' + currentRow]) {
        result['WHC_SB'].push({
          VC: currentWorkingSheet['A' + currentRow].v,
          W_KLN_HWY: currentWorkingSheet['B' + currentRow].v,
          LIN_CHEUNG_RD: currentWorkingSheet['C' + currentRow].v,
          JORDAN_RD: currentWorkingSheet['D' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
      while (currentWorkingSheet['F' + currentRow]) {
        result['WHC_NB'].push({
          VC: currentWorkingSheet['F' + currentRow].v,
          CONNAUGHT_RD_W_WB: currentWorkingSheet['G' + currentRow].v,
          CONNAUGHT_RD_W_EB: currentWorkingSheet['H' + currentRow].v,
          HILL_RD_FO: currentWorkingSheet['I' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
    } else if (sheet.includes('CHT')) {
      while (currentWorkingSheet['A' + currentRow]) {
        result['CHT_SB'].push({
          VC: currentWorkingSheet['A' + currentRow].v,
          GASCOIGNE_RD: currentWorkingSheet['B' + currentRow].v,
          PRINCESS_MARGARET_RD: currentWorkingSheet['C' + currentRow].v,
          CHATHAM_RD_N: currentWorkingSheet['D' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
      while (currentWorkingSheet['F' + currentRow]) {
        result['CHT_NB'].push({
          VC: currentWorkingSheet['F' + currentRow].v,
          GLOUCESTER_RD_EB: currentWorkingSheet['G' + currentRow].v,
          CANAL_RD_FO: currentWorkingSheet['H' + currentRow].v,
          IEC_WB_CHT: currentWorkingSheet['I' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
    } else if (sheet.includes('EHC')) {
      while (currentWorkingSheet['A' + currentRow]) {
        result['EHC_SB'].push({
          VC: currentWorkingSheet['A' + currentRow].v,
          KWUN_TONG_BYPASS: currentWorkingSheet['B' + currentRow].v,
          TKOT: currentWorkingSheet['C' + currentRow].v,
          KWUN_TONG_RD: currentWorkingSheet['D' + currentRow].v,
          TKO_LTT: currentWorkingSheet['E' + currentRow].v,
          LEI_YUE_MUN_RD_SLIP_RD: currentWorkingSheet['F' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
      while (currentWorkingSheet['F' + currentRow]) {
        result['EHC_NB'].push({
          VC: currentWorkingSheet['H' + currentRow].v,
          IEC_EB: currentWorkingSheet['I' + currentRow].v,
          IEC_WB_EHC: currentWorkingSheet['J' + currentRow].v,
        })
        currentRow++
      }
      currentRow = 3 // reset currentRow
    }
  }

  return result
}