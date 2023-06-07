
let controller = {}

controller.index = function (req, res) {
  function fuzzy_sugeno(input_jarak, input_kapasitas) {
    // Input variabel jarak
    let j_dekat, j_sedang, j_jauh;
    if (input_jarak <= 200) {
      j_dekat = 1;
    } else if (input_jarak >= 200 && input_jarak <= 400) {
      j_dekat = (400 - input_jarak) / 200;
    } else if (input_jarak >= 400) {
      j_dekat = 0;
    }

    if (input_jarak <= 200 || input_jarak >= 600) {
      j_sedang = 0;
    } else if (input_jarak >= 200 && input_jarak <= 400) {
      j_sedang = (input_jarak - 200) / 200;
    } else if (input_jarak >= 400 && input_jarak <= 600) {
      j_sedang = (600 - input_jarak) / 200;
    }

    if (input_jarak <= 400) {
      j_jauh = 0;
    } else if (input_jarak >= 400 && input_jarak <= 600) {
      j_jauh = (input_jarak - 400) / 200;
    } else if (input_jarak >= 600) {
      j_jauh = 1;
    }

    // Input variabel kapasitas
    let k_longgar, k_cukup, k_padat;
    if (input_kapasitas <= 20) {
      k_longgar = 1;
    } else if (input_kapasitas >= 20 && input_kapasitas <= 50) {
      k_longgar = (50 - input_kapasitas) / 30;
    } else if (input_kapasitas >= 50) {
      k_longgar = 0;
    }

    if (input_kapasitas <= 20 || input_kapasitas >= 80) {
      k_cukup = 0;
    } else if (input_kapasitas >= 20 && input_kapasitas <= 50) {
      k_cukup = (input_kapasitas - 20) / 30;
    } else if (input_kapasitas >= 50 && input_kapasitas <= 80) {
      k_cukup = (80 - input_kapasitas) / 30;
    }

    if (input_kapasitas <= 50) {
      k_padat = 0;
    } else if (input_kapasitas >= 50 && input_kapasitas <= 80) {
      k_padat = (input_kapasitas - 50) / 30;
    } else if (input_kapasitas >= 80) {
      k_padat = 1;
    }

    // Nilai jarak
    let nilai_jarak, nilai_kapasitas;
    if (j_dekat > j_sedang) {
      nilai_jarak = j_dekat;
    } else if (j_sedang > j_jauh) {
      nilai_jarak = j_sedang;
    } else {
      nilai_jarak = j_jauh;
    }

    // Nilai kapasitas
    if (k_longgar > k_cukup) {
      nilai_kapasitas = k_longgar;
    } else if (k_cukup > k_padat) {
      nilai_kapasitas = k_cukup;
    } else {
      nilai_kapasitas = k_padat;
    }

    const rendah = 40;
    const sedang = 60;
    const tinggi = 80;

    // Rule
    const a_rule1 = Math.min(k_longgar, j_dekat);
    const a_rule2 = Math.min(k_longgar, j_sedang);
    const a_rule3 = Math.min(k_longgar, j_jauh);
    const a_rule4 = Math.min(k_cukup, j_dekat);
    const a_rule5 = Math.min(k_cukup, j_sedang);
    const a_rule6 = Math.min(k_cukup, j_jauh);
    const a_rule7 = Math.min(k_padat, j_dekat);
    const a_rule8 = Math.min(k_padat, j_sedang);
    const a_rule9 = Math.min(k_padat, j_jauh);

    // Jumlah ai.zi
    const jml_aizi =
      a_rule1 * tinggi +
      a_rule2 * tinggi +
      a_rule3 * sedang +
      a_rule4 * tinggi +
      a_rule5 * sedang +
      a_rule6 * rendah +
      a_rule7 * sedang +
      a_rule8 * rendah +
      a_rule9 * rendah;
    // Jumlah ai
    const jml_ai =
      a_rule1 +
      a_rule2 +
      a_rule3 +
      a_rule4 +
      a_rule5 +
      a_rule6 +
      a_rule7 +
      a_rule8 +
      a_rule9;

    // Difuzzyfikasi
    const hasil_fuzzy_sugeno = jml_aizi / jml_ai;
    return hasil_fuzzy_sugeno;
  }

  const hasil_a = fuzzy_sugeno(300, 10);


  res.json({
    Messsage: "success",
    hasil_a
  })

};

module.exports = controller;