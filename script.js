document.getElementById('roll-btn').addEventListener('click', function() {
    // Captura de datos de la interfaz
    const razaAtq = document.getElementById('raza-atq').value;
    const arma = document.getElementById('arma').value;
    let boBase = parseInt(document.getElementById('bo').value) || 0;
    
    const razaDef = document.getElementById('raza-def').value;
    let bdBase = parseInt(document.getElementById('bd').value) || 0;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    
    const diceContainer = document.getElementById('dice-container');
    const resultBox = document.getElementById('result-box');
    
    diceContainer.innerText = "...";
    diceContainer.style.display = 'block';
    diceContainer.classList.add('spinning');
    resultBox.style.display = 'none';
    
    setTimeout(() => {
        diceContainer.classList.remove('spinning');
        
        // --- 🎲 SISTEMA DE DADOS ABIERTOS ---
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        
        while (dadoOriginal >= 96) {
            dadoOriginal = Math.floor(Math.random() * 100) + 1;
            totalDados += dadoOriginal;
            logTiradas.push(dadoOriginal);
        }
        diceContainer.innerText = totalDados;

        // --- 🧑‍🤝‍🧑 MODIFICADORES DE RAZA AUTOMÁTICOS ---
        let modBO = 0;
        let textoModBO = "";
        let modBD = 0;
        let textoModBD = "";
        let mitigacionEnano = 0;

        // Modificadores Atacante
        if (razaAtq === 'elfo') {
            if (arma === 'filo' || arma === 'proyectil') { modBO = 10; textoModBO = " (+10 Raza: Destreza Elfa)"; }
        } else if (razaAtq === 'enano') {
            if (arma === 'contundente') { modBO = 10; textoModBO = " (+10 Raza: Fuerza Enana)"; }
        } else if (razaAtq === 'orco') {
            if (arma === 'filo' || arma === 'contundente') { modBO = 5; textoModBO = " (+5 Raza: Furia de Orco)"; }
            if (arma === 'proyectil') { modBO = -10; textoModBO = " (-10 Raza: Mala vista al sol)"; }
        } else if (razaAtq === 'hobbit') {
            if (arma === 'proyectil') { modBO = 15; textoModBO = " (+15 Raza: Puntería Hobbit)"; }
            if (arma === 'contundente') { modBO = -15; textoModBO = " (-15 Raza: Arma demasiado grande)"; }
        } else if (razaAtq === 'humano') {
            modBO = 5; textoModBO = " (+5 Raza: Linaje Dúnadan)";
        }

        // Modificadores Defensor
        if (razaDef === 'hobbit') { modBD = 15; textoModBD = " (+15 Raza: Blanco pequeño/Esquiva)"; }
        else if (razaDef === 'elfo') { modBD = 5; textoModBD = " (+5 Raza: Reflejos Elfos)"; }
        else if (razaDef === 'humano') { modBD = 5; textoModBD = " (+5 Raza: Presencia)"; }
        else if (razaDef === 'enano') { mitigacionEnano = 2; } // Robustez física

        // Aplicar los modificadores a los totales de combate
        let boFinal = boBase + modBO;
        let bdFinal = bdBase + modBD;
        let resultadoTabla = totalDados + boFinal - bdFinal;

        // --- 🗂️ LÓGICA DE TABLAS DE DAÑO ---
        let respuestaCombate = "";
        
        if (logTiradas[0] <= 4) { // Pifia
            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 22px; font-weight: bold; margin-bottom: 10px;">💥 ¡¡PIFIA DE COMBATE!! 💥</div>
                <p>El atacante ha tenido un descuido fatal. Tropieza de forma estrepitosa. Quedas <strong>aturdido durante 1 asalto</strong> y sufres -20 a tu siguiente acción.</p>
            `;
        } else {
            let pvDaño = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";
            let tipoCritico = arma;

            // Tabla Filo
            if (arma === 'filo') {
                if (resultadoTabla <= 40) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 5 : (ta <= 8) ? 3 : (ta <= 12) ? 1 : 0;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 10 : (ta <= 8) ? 7 : (ta <= 12) ? 4 : (ta <= 16) ? 2 : 0;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 15 : (ta <= 8) ? 12 : (ta <= 12) ? 9 : (ta <= 16) ? 5 : 2;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 18 : (ta <= 8) ? 15 : (ta <= 12) ? 11 : (ta <= 16) ? 7 : 4; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 22 : (ta <= 8) ? 19 : (ta <= 12) ? 14 : (ta <= 16) ? 11 : 6; rangoCritico = "A"; if(ta<=4) rangoCritico="B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 26 : (ta <= 8) ? 23 : (ta <= 12) ? 18 : (ta <= 16) ? 14 : 10; rangoCritico = "A"; if(ta<=8) rangoCritico="B"; if(ta<=4) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 32 : (ta <= 8) ? 28 : (ta <= 12) ? 23 : (ta <= 16) ? 19 : 15; rangoCritico = "A"; if(ta<=16) rangoCritico="B"; if(ta<=12) rangoCritico="C"; if(ta<=8) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }
            // Tabla Contundente
            else if (arma === 'contundente') {
                if (resultadoTabla <= 40) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 8) ? 4 : 2;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 8) ? 9 : 6;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 14 : (ta <= 12) ? 11 : 8;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 18 : (ta <= 12) ? 15 : 12; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 23 : (ta <= 12) ? 19 : 16; rangoCritico = (ta >= 13) ? "A" : "B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 27 : (ta <= 12) ? 24 : 20; rangoCritico = "B"; if(ta<=8) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 34 : (ta <= 12) ? 30 : 25; rangoCritico = "C"; if(ta<=12) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }
            // Tabla Proyectil
            else if (arma === 'proyectil') {
                if (resultadoTabla <= 45) pvDaño = 0;
                else if (resultadoTabla <= 65) pvDaño = (ta <= 4) ? 7 : (ta <= 12) ? 2 : 0;
                else if (resultadoTabla <= 85) pvDaño = (ta <= 4) ? 13 : (ta <= 12) ? 6 : 1;
                else if (resultadoTabla <= 100) pvDaño = (ta <= 4) ? 19 : (ta <= 12) ? 10 : 3;
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 24 : (ta <= 12) ? 14 : 6; rangoCritico = (ta <= 8) ? "A" : "Ninguno"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 28 : (ta <= 12) ? 18 : 9; rangoCritico = "A"; if(ta<=4) rangoCritico="B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 32 : (ta <= 12) ? 22 : 12; rangoCritico = "B"; if(ta<=4) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 38 : (ta <= 12) ? 27 : 16; rangoCritico = "B"; if(ta<=12) rangoCritico="C"; if(ta<=8) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }

            // Aplicar mitigación por robustez Enana
            if (mitigacionEnano > 0 && pvDaño > 0) {
                pvDaño = Math.max(1, pvDaño - mitigacionEnano);
                descCritico += `<br><small style="color:#4da6ff;">🛡️ Robustez Enana: Se reducen ${mitigacionEnano} PV del impacto inicial.</small>`;
            }

            // Textos de críticos
            if (rangoCritico !== "Ninguno") {
                if (tipoCritico === 'filo') {
                    const criticosFilo = {
                        "A": "⚔️ <strong>Rango A:</strong> Tajo rápido en el brazo. El defensor sufre <span style='color:#ff4d4d;'>+3 PV extra</span> y -5 a su próximo turno.",
                        "B": "🩸 <strong>Rango B:</strong> Corte profundo en el muslo. Pierde <span style='color:#ff4d4d;'>+5 PV extra</span>, sangra (1 PV/asalto) y sufre -10 general.",
                        "C": "🦴 <strong>Rango C:</strong> Impacto violento en el costado. Rompe una costilla. Sufre <span style='color:#ff4d4d;'>+8 PV extra</span> y queda <strong>Aturdido 1 asalto</strong>.",
                        "D": "💀 <strong>Rango D:</strong> ¡Golpe tremendo! Desgarra la armadura. Recibe <span style='color:#ff4d4d;'>+12 PV extra</span> y queda <strong>Aturdido 2 asaltos</strong>.",
                        "E": "🦅 <strong>Rango E:</strong> ¡Estocada magistral! El oponente cae al suelo. Recibe <span style='color:#ff4d4d;'>+20 PV extra</span> y queda <strong>Aturdido 3 asaltos</strong>."
                    };
                    descCritico = criticosFilo[rangoCritico] + descCritico;
                } else if (tipoCritico === 'contundente') {
                    const criticosCont = {
                        "A": "💥 <strong>Rango A:</strong> Impacto sordo en el hombro. Sufre <span style='color:#ff4d4d;'>+2 PV extra</span> y un -5 general por dolor.",
                        "B": "🦴 <strong>Rango B:</strong> Fuerte golpe en las costillas con crujido espantoso. Pierde <span style='color:#ff4d4d;'>+5 PV extra</span> y queda <strong>Aturdido 1 asalto</strong>.",
                        "C": "🧠 <strong>Rango C:</strong> Mazazo brutal al casco. El enemigo trastabilla mareado. Recibe <span style='color:#ff4d4d;'>+8 PV extra</span> y queda <strong>Aturdido 2 asaltos</strong>.",
                        "D": "🦵 <strong>Rango D:</strong> ¡Rodilla abollada! Cae de rodillas al suelo. Recibe <span style='color:#ff4d4d;'>+12 PV extra</span> y queda <strong>Aturdido 3 asaltos</strong>.",
                        "E": "💀 <strong>Rango E:</strong> ¡Impacto demoledor! Órganos dañados y armadura aplastada. +20 PV extra y <strong>Aturdido 4 asaltos</strong>."
                    };
                    descCritico = criticosCont[rangoCritico] + descCritico;
                } else if (tipoCritico === 'proyectil') {
                    const criticosProj = {
                        "A": "🎯 <strong>Rango A:</strong> Flecha clavada en el muslo. Rozadura limpia. Sufrirá <span style='color:#ff4d4d;'>+3 PV extra</span> y un -5 general.",
                        "B": "🩸 <strong>Rango B:</strong> El proyectil atraviesa el hombro. Sangrado constante (1 PV/asalto) y añade <span style='color:#ff4d4d;'>+5 PV extra</span>.",
                        "C": "🏹 <strong>Rango C:</strong> Impacto profundo. Intenta arrancarse la flecha. Queda <strong>Aturdido 1 asalto</strong>, sangra 2 PV y recibe <span style='color:#ff4d4d;'>+8 PV extra</span>.",
                        "D": "👁️ <strong>Rango D:</strong> ¡Blanco certero! Flecha alojada cerca de zona vital. Recibe <strong>+12 PV extra</strong> y queda <strong>Aturdido 2 asaltos</strong>.",
                        "E": "💀 <strong>Rango E:</strong> ¡Impacto letal en el pecho! Perfora fuertemente el pulmón. Cae al suelo incapacitado. Recibe <strong>+22 PV extra</strong> y queda <strong>Aturdido 4 asaltos</strong>."
                    };
                    descCritico = criticosProj[rangoCritico] + descCritico;
                }
            } else {
                descCritico = "⚔️ Golpe limpio pero superficial. Sin efectos críticos añadidos." + descCritico;
            }

            respuestaCombate = `
                <div style="font-size: 28px; color: #ffcc00; font-weight: bold; margin-bottom: 15px;">
                    💥 Daño total: ${pvDaño} PV 💥
                </div>
                <div style="background-color: #252525; padding: 12px; border-radius: 6px; border-left: 4px solid #b71c1c; text-align: left; font-size: 16px;">
                    ${descCritico}
                </div>
            `;
        }
        
        // --- 📜 NARRATIVA AMBIENTAL HISTÓRICA ---
        let textoNarrativo = "¡Un choque de voluntades y acero bajo el cielo de la Tierra Media!";
        if ((razaAtq === 'orco' && razaDef === 'elfo') || (razaAtq === 'elfo' && razaDef === 'orco')) {
            textoNarrativo = "📜 <em>¡El odio ancestral de las Guerras de Beleriand estalla! El Primer Nacido y la aberración de Morgoth cruzan armas a muerte.</em>";
        } else if ((razaAtq === 'orco' && razaDef === 'enano') || (razaAtq === 'enano' && razaDef === 'orco')) {
            textoNarrativo = "📜 <em>¡Las viejas e sangrientas rencillas de Moria y de las Montañas Nubladas se deciden hoy aquí con sangre!</em>";
        } else if (razaAtq === 'hobbit') {
            textoNarrativo = "📜 <em>¡Un inesperado y valiente mediano se alza con fiereza desafiando los peligros de la Tierra Media!</em>";
        } else if (razaAtq === 'humano' && razaDef === 'orco') {
            textoNarrativo = "📜 <em>¡La nobleza de Númenor resiste el empuje de la Sombra del Este!</em>";
        }

        let textoLog = logTiradas.length > 1 ? ` <span style="color:#ffcc00;">(¡Tirada Abierta!: ${logTiradas.join(' + ')})</span>` : '';
        const nombresArmas = { filo: "Espada Ancha", contundente: "Gran Hacha", proyectil: "Arco Largo" };
        const nombresRazas = { humano: "Humano", elfo: "Elfo", enano: "Enano", orco: "Orco", hobbit: "Hobbit" };

        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Resultado del Ataque ⚔️</h3>
            <p style="font-size: 14px; color: #ffcc00; margin-bottom: 12px;">${textoNarrativo}</p>
            <p style="font-size: 16px; margin: 6px 0;"><strong>Enfrentamiento:</strong> ${nombresRazas[razaAtq]} con ${nombresArmas[arma]} vs ${nombresRazas[razaDef]} (TA-${ta})</p>
            <p style="font-size: 14px; color: #aaaaaa; margin: 4px 0;">
                BO Final: ${boBase}${textoModBO} | BD Final: ${bdBase}${textoModBD}
            </p>
            <p style="font-size: 15px; margin: 6px 0;"><strong>Dado:</strong> ${totalDados}${textoLog} | <strong>Cálculo:</strong> ${totalDados} + ${boFinal} (BO) - ${bdFinal} (BD)</p>
            <p style="font-size: 18px; margin: 10px 0;">Total en Tabla: <strong style="color: #ffcc00;">${resultadoTabla}</strong></p>
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
