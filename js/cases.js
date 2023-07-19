import * as Route from './coordinates.js';

// Destruct route
const { W_KLN_HWY, LIN_CHEUNG_RD, JORDAN_RD, W_KLN_CORRIDOR, PRINCESS_MARGARET_RD, E_KLN_CORRIDOR, KUWN_TONG_BYPASS, KWUN_TONG_RD, ABERDEEN_TUNNEL, IEC_WB_CHT, HARCOURT_RD, CONNAUGHT_RD_C_WB, IEC_EB, IEC_WB_EHC, TKO_LT_TUNNEL } = Route

// Alias
const WHC_APPROACGING_RD = CONNAUGHT_RD_C_WB

const route = (coordinates, distance) => ({ coordinates: coordinates, distance: distance })

const cases = [
  {
    caseNo: 0,
    toll: { WHC: 75, CHT: 20, EHC: 25 },
    flow: { AM: 1000, PM: 1000 },
    route: [
      route(LIN_CHEUNG_RD, 100),
      route(JORDAN_RD, 100),
      route(W_KLN_HWY, 100),
      route(W_KLN_CORRIDOR, 100),
      route(PRINCESS_MARGARET_RD, 100),
      route(E_KLN_CORRIDOR, 100),
      route(KUWN_TONG_BYPASS, 100),
      route(KWUN_TONG_RD, 100),
      route(TKO_LT_TUNNEL, 100),
      route(ABERDEEN_TUNNEL, 100),
      route(IEC_WB_CHT, 100),
      route(HARCOURT_RD, 100),
      route(WHC_APPROACGING_RD, 100),
      route(IEC_EB, 100),
      route(IEC_WB_EHC, 100),
    ],
  },
]

export const getCase = (caseNo) => {
  const currentCase = cases.find(c => c.caseNo === caseNo)

  let result = {
    toll: currentCase.toll,
    flow: currentCase.flow,
    route: [],
  }

  currentCase.route.forEach(r => {
    result.route.push(r)
  })
  
  return result
}