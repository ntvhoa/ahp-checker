/* Phần tính toán AHP – dùng chung cho trình duyệt (window.AHP) và Node (kiểm thử). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AHP = factory();
})(this, function () {
  // Chỉ số ngẫu nhiên RI của Saaty (dùng cho phần kiểm tra tính nhất quán – phần bổ sung, không có trong slide)
  var RI = { 1: 0, 2: 0, 3: 0.58, 4: 0.90, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49 };

  // Đọc số: chấp nhận "4", "0,25", "1.5", "1/4"
  function parseNum(s) {
    if (typeof s === 'number') return s;
    s = String(s == null ? '' : s).trim().replace(',', '.');
    if (!s) return NaN;
    if (s.indexOf('/') >= 0) {
      var p = s.split('/');
      if (p.length !== 2) return NaN;
      return Number(p[0]) / Number(p[1]);
    }
    return Number(s);
  }

  // Lập ma trận so sánh cặp đôi n×n. getPair(i, j) với i < j trả về [điểm bên trái, điểm bên phải].
  // a(i,j) = trái / phải, a(j,i) = phải / trái (so sánh theo hàng ngang).
  function buildMatrix(n, getPair) {
    var A = [], bad = [];
    for (var i = 0; i < n; i++) { A.push([]); for (var j = 0; j < n; j++) A[i].push(i === j ? 1 : NaN); }
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var p = getPair(i, j) || [];
      var l = parseNum(p[0]), r = parseNum(p[1]);
      if (!(l > 0) || !(r > 0) || !isFinite(l) || !isFinite(r)) { bad.push([i, j]); continue; }
      A[i][j] = l / r;
      A[j][i] = r / l;
    }
    return { matrix: A, invalid: bad };
  }

  function mul(A, B) {
    var n = A.length, C = [];
    for (var i = 0; i < n; i++) {
      C.push([]);
      for (var j = 0; j < n; j++) {
        var s = 0;
        for (var k = 0; k < n; k++) s += A[i][k] * B[k][j];
        C[i].push(s);
      }
    }
    return C;
  }

  function maxAbs(v) { return v.reduce(function (m, x) { return Math.max(m, Math.abs(x)); }, 0); }

  // Bình phương ma trận liên tiếp; mỗi lần: tổng hàng → chuẩn hóa thành trọng số → so sánh với lần trước.
  function iterate(A, opts) {
    opts = opts || {};
    var minIter = opts.minIter || 3, maxIter = opts.maxIter || 10, tol = opts.tol || 1e-6;
    var M = A, prev = null, its = [], factor = 1;
    for (var k = 1; k <= maxIter; k++) {
      M = mul(M, M);
      var big = 0;
      M.forEach(function (row) { row.forEach(function (x) { if (x > big) big = x; }); });
      if (big > 1e150) { // tránh tràn số: chia cả ma trận cho cùng một số (không làm đổi trọng số)
        M = M.map(function (row) { return row.map(function (x) { return x / big; }); });
        factor = 0;
      }
      var sums = M.map(function (row) { return row.reduce(function (a, b) { return a + b; }, 0); });
      var total = sums.reduce(function (a, b) { return a + b; }, 0);
      var w = sums.map(function (s) { return s / total; });
      var diff = prev ? w.map(function (x, i) { return x - prev[i]; }) : null;
      its.push({ k: k, matrix: M, sums: sums, total: total, weights: w, diff: diff, rescaled: factor === 0 });
      if (k >= minIter && diff && maxAbs(diff) < tol) break;
      prev = w;
    }
    return its;
  }

  // Kiểm tra tính nhất quán (λmax, CI, CR) theo Saaty
  function consistency(A, w) {
    var n = A.length;
    if (n < 3) return { lambda: n, CI: 0, RI: RI[n] || 0, CR: 0 };
    var lam = 0;
    for (var i = 0; i < n; i++) {
      var s = 0;
      for (var j = 0; j < n; j++) s += A[i][j] * w[j];
      lam += s / w[i];
    }
    lam /= n;
    var CI = (lam - n) / (n - 1), ri = RI[n] || RI[10];
    return { lambda: lam, CI: CI, RI: ri, CR: ri ? CI / ri : 0 };
  }

  // Phân tích đầy đủ một ma trận. pick = số lần bình phương lấy kết quả (0 = lần cuối khi hội tụ).
  function analyse(n, getPair, pick) {
    var b = buildMatrix(n, getPair);
    if (b.invalid.length) return { matrix: b.matrix, invalid: b.invalid };
    var its = iterate(b.matrix);
    var used = pick && pick <= its.length ? its[pick - 1] : its[its.length - 1];
    var next = its[used.k] || null; // lần kế tiếp (để xem mức chênh lệch)
    var last = its[its.length - 1];
    return {
      matrix: b.matrix, invalid: [], iterations: its, used: used,
      weights: used.weights,
      nextDiff: next ? maxAbs(next.diff) : null,
      consistency: consistency(b.matrix, last.weights)
    };
  }

  // Tổng hợp: điểm có trọng số = trọng số tiêu chí × trọng số phương án theo tiêu chí đó
  function aggregate(critW, altW) {
    var weighted = critW.map(function (cw, c) { return altW[c].map(function (aw) { return cw * aw; }); });
    var nAlt = altW[0].length, totals = [];
    for (var a = 0; a < nAlt; a++) totals.push(weighted.reduce(function (s, row) { return s + row[a]; }, 0));
    return { weighted: weighted, totals: totals };
  }

  return { RI: RI, parseNum: parseNum, buildMatrix: buildMatrix, iterate: iterate,
           consistency: consistency, analyse: analyse, aggregate: aggregate };
});
