document.getElementById('roll-btn').addEventListener('click', function() {
    const arma = document.getElementById('arma').value;
    const bo = parseInt(document.getElementById('bo').value) || 0;
    const bd = parseInt(document.getElementById('bd').value) || 0;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    
    const diceContainer = document.getElementById('dice-container');
    const resultBox = document.getElementById('result-box');
    
    diceContainer.innerText = "...";
    diceContainer.style.display = 'block';
    diceContainer.classList.add('spinning');
    resultBox.style.display = 'none';
    
    setTimeout(() => {
        diceContainer.classList.remove('spinning');
        
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        
        // TIRADA ABIERTA
        while (dadoOriginal >= 96) {
            dadoOriginal = Math.floor(Math.random() * 100) + 1;
            totalDados += dadoOriginal;
            logTiradas.push(dadoOriginal);
        }
        
        let resultadoTabla = totalDados + bo - bd;
        diceContainer.innerText = totalDados;

        let respuestaCombate = "";
        
        // PIFIA (01-04)
        if (logTiradas[0] <= 4) {
            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 22px; font-weight: bold; margin-bottom: 10px;">💥 ¡¡PIFIA DE COMBATE!! 💥</div>
                <p>Has sacado un <strong>${logTiradas[0]} natural</strong>. Tu ataque falla estrepitosamente. Quedas <strong>aturdido durante 1 asalto</strong> y sufres -20 a tu siguiente acción.</p>
            `;
        } else {
            let pvDaño = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";
            let tipoCritico = ""; // 'filo', 'contundente' o 'proyectil'

            // ==========================================
            // LOGICA TABLA 1: ESPADA ANCHA (FILO)
            // ==========================================
            if (arma === 'filo') {
                tipoCritico = 'filo';
                if (resultadoTabla <= 40) { pvDaño = 0; }
                else if (resultadoTabla <= 65) { pvDaño = (ta <= 4) ? 5 : (ta <= 8) ? 3 : (ta <= 12) ? 1 : 0; }
                else if (resultadoTabla <= 85) { pvDaño = (ta <= 4) ? 10 : (ta <= 8) ? 7 : (ta <= 12) ? 4 : (ta <= 16) ? 2 : 0; }
                else if (resultadoTabla <= 100) { pvDaño = (ta <= 4) ? 15 : (ta <= 8) ? 12 : (ta <= 12) ? 9 : (ta <= 16) ? 5 : 2; }
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 18 : (ta <= 8) ? 15 : (ta <= 12) ? 11 : (ta <= 16) ? 7 : 4; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 22 : (ta <= 8) ? 19 : (ta <= 12) ? 14 : (ta <= 16) ? 11 : 6; rangoCritico = (ta <= 16) ? "A" : "Ninguno"; if(ta<=4) rangoCritico="B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 26 : (ta <= 8) ? 23 : (ta <= 12) ? 18 : (ta <= 16) ? 14 : 10; rangoCritico = "A"; if(ta<=8) rangoCritico="B"; if(ta<=4) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 32 : (ta <= 8) ? 28 : (ta <= 12) ? 23 : (ta <= 16) ? 19 : 15; rangoCritico = "A"; if(ta<=16) rangoCritico="B"; if(ta<=12) rangoCritico="C"; if(ta<=8) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }
            // ==========================================
            // LOGICA TABLA 2: GRAN HACHA (CONTUNDENTE)
            // ==========================================
            else if (arma === 'contundente') {
                tipoCritico = 'contundente';
                // Hace buen daño a armaduras pesadas (TA altas) por impacto sordo
                if (resultadoTabla <= 40) { pvDaño = 0; }
                else if (resultadoTabla <= 65) { pvDaño = (ta <= 8) ? 4 : 2; }
                else if (resultadoTabla <= 85) { pvDaño = (ta <= 8) ? 9 : 6; }
                else if (resultadoTabla <= 100) { pvDaño = (ta <= 4) ? 14 : (ta <= 12) ? 11 : 8; }
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 18 : (ta <= 12) ? 15 : 12; rangoCritico = "A"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 23 : (ta <= 12) ? 19 : 16; rangoCritico = (ta >= 13) ? "A" : "B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 27 : (ta <= 12) ? 24 : 20; rangoCritico = "B"; if(ta<=8) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 34 : (ta <= 12) ? 30 : 25; rangoCritico = "C"; if(ta<=12) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }
            // ==========================================
            // LOGICA TABLA 3: ARCO LARGO (PROYECTILES)
            // ==========================================
            else if (arma === 'proyectil') {
                tipoCritico = 'proyectil';
                // Letal contra ropa (TA baja), inútil contra placas pesadas (TA alta)
                if (resultadoTabla <= 45) { pvDaño = 0; }
                else if (resultadoTabla <= 65) { pvDaño = (ta <= 4) ? 7 : (ta <= 12) ? 2 : 0; }
                else if (resultadoTabla <= 85) { pvDaño = (ta <= 4) ? 13 : (ta <= 12) ? 6 : 1; }
                else if (resultadoTabla <= 100) { pvDaño = (ta <= 4) ? 19 : (ta <= 12) ? 10 : 3; }
                else if (resultadoTabla <= 115) { pvDaño = (ta <= 4) ? 24 : (ta <= 12) ? 14 : 6; rangoCritico = (ta <= 8) ? "A" : "Ninguno"; }
                else if (resultadoTabla <= 130) { pvDaño = (ta <= 4) ? 28 : (ta <= 12) ? 18 : 9; rangoCritico = "A"; if(ta<=4) rangoCritico="B"; }
                else if (resultadoTabla <= 145) { pvDaño = (ta <= 4) ? 32 : (ta <= 12) ? 22 : 12; rangoCritico = "B"; if(ta<=4) rangoCritico="C"; }
                else { pvDaño = (ta <= 4) ? 38 : (ta <= 12) ? 27 : 16; rangoCritico = "B"; if(ta<=12) rangoCritico="C"; if(ta<=8) rangoCritico="D"; if(ta<=4) rangoCritico="E"; }
            }

            // TEXTOS NARRATIVOS SEGÚN EL TIPO DE CRÍTICO
            if (rangoCritico !== "Ninguno") {
                if (tipoCritico === 'filo') {
                    const criticosFilo = {
                        "A": "⚔️ <strong>Crítico de Filo (Rango A):</strong> Un tajo rápido en el brazo. El defensor sufre <span style='color:#ff4d4d;'>+3 PV extra</span> y un penalizador de <strong>-5</strong> a su próximo turno.",
                        "B": "🩸 <strong>Crítico de Filo (Rango B):</strong> Corte profundo en el muslo. Pierde <span style='color:#ff4d4d;'>+5 PV extra</span>, empieza a <strong>sangrar (1 PV/asalto)</strong> y sufre un <strong>-10</strong> general.",
                        "C": "🦴 <strong>Crítico de Filo (Rango C):</strong> Impacto violento en el costado. Rompe una costilla. El enemigo sufre <span style='color:#ff4d4d;'>+8 PV extra</span> y queda <strong>Aturdido durante 1 asalto</strong>.",
                        "D": "💀 <strong>Crítico de Filo (Rango D):</strong> ¡Golpe tremendo! Desgarra la armadura. Recibe <span style='color:#ff4d4d;'>+12 PV extra</span>, queda <strong>Aturdido durante 2 asaltos</strong> y sufre un masivo <strong>-20</strong>.",
                        "E": "🦅 <strong>Crítico de Filo (Rango E):</strong> ¡Estocada magistral! El oponente cae al suelo. Recibe <span style='color:#ff4d4d;'>+20 PV extra</span>, queda <strong>Aturdido durante 3 asaltos</strong> y sangra de gravedad."
                    };
                    descCritico = criticosFilo[rangoCritico];
                } else if (tipoCritico === 'contundente') {
                    const criticosCont = {
                        "A": "💥 <strong>Crítico de Aplastamiento (Rango A):</strong> Impacto sordo en el hombro. El defensor sufre <span style='color:#ff4d4d;'>+2 PV extra</span> y un <strong>-5</strong> a su acción por el dolor del golpe.",
                        "B": "🦴 <strong>Crítico de Aplastamiento (Rango B):</strong> Fuerte golpe en las costillas con crujido espantoso. Pierde <span style='color:#ff4d4d;'>+5 PV extra</span> y queda <strong>Aturdido durante 1 asalto</strong>.",
                        "C": "🧠 <strong>Crítico de Aplastamiento (Rango C):</strong> Mazazo brutal directo al casco. El enemigo trastabilla mareado. Recibe <span style='color:#ff4d4d;'>+8 PV extra</span> y queda <strong>Aturdido durante 2 asaltos</strong>.",
                        "D": "🦵 <strong>Crítico de Aplastamiento (Rango D):</strong> ¡Rodilla abollada! El defensor cae de rodillas al suelo. Recibe <span style='color:#ff4d4d;'>+12 PV extra</span>, queda <strong>Aturdido durante 3 asaltos</strong> y pierde movilidad.",
                        "E": "💀 <strong>Crítico de Aplastamiento (Rango E):</strong> ¡Impacto demoledor en el torso! Órganos internos dañados y armadura aplastada. +20 PV extra, derribado y <strong>Aturdido durante 4 asaltos</strong>."
                    };
                    descCritico = criticosCont[rangoCritico];
                } else if (tipoCritico === 'proyectil') {
                    const criticosProj = {
                        "A": "🎯 <strong>Crítico de Perforación (Rango A):</strong> Flecha clavada en el muslo. Una rozadura limpia pero dolorosa. Sufrirá <span style='color:#ff4d4d;'>+3 PV extra</span> y un penalizador de <strong>-5</strong>.",
                        "B": "🩸 <strong>Crítico de Perforación (Rango B):</strong> El proyectil atraviesa el hombro. Sangrado constante (<span style='color:#ff4d4d;'>1 PV por asalto</span>) y añade <strong>+5 PV extra</strong> de daño.",
                        "C": "🏹 <strong>Crítico de Perforación (Rango C):</strong> Impacto profundo en el costado. El defensor intenta arrancarse la flecha. Queda <strong>Aturdido 1 asalto</strong>, sangra 2 PV/asalto y recibe <strong>+8 PV extra</strong>.",
                        "D": "👁️ <strong>Crítico de Perforación (Rango D):</strong> ¡Blanco certero! Flecha alojada cerca de una zona vital. Recibe <strong>+12 PV extra</strong>, queda <strong>Aturdido 2 asaltos</strong> y sufre un tremendo <strong>-25</strong> general.",
                        "E": "💀 <strong>Crítico de Perforación (Rango E):</strong> ¡Impacto letal en el pecho! La flecha perfora profundamente el pulmón. El enemigo cae al suelo incapacitado. Recibe <strong>+22 PV extra</strong> y queda <strong>Aturdido 4 asaltos</strong>."
                    };
                    descCritico = criticosProj[rangoCritico];
                }
            } else {
                descCritico = "⚔️ Golpe limpio pero superficial. Sin efectos críticos añadidos.";
            }

            respuestaCombate = `
                <div style="font-size: 28px; color: #ffcc00; font-weight: bold; margin-bottom: 15px;">
                    💥 Daño infligido: ${pvDaño} PV 💥
                </div>
                <div style="background-color: #252525; padding: 12px; border-radius: 6px; border-left: 4px solid #b71c1c; text-align: left; font-size: 16px;">
                    ${descCritico}
                </div>
            `;
        }
        
        let textoLog = logTiradas.length > 1 ? ` <span style="color:#ffcc00;">(¡Tirada Abierta!: ${logTiradas.join(' + ')})</span>` : '';
        const nombresArmas = { filo: "Espada Ancha", contundente: "Gran Hacha / Maza", proyectil: "Arco Largo" };

        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Resultado del Ataque ⚔️</h3>
            <p style="font-size: 16px; margin: 8px 0;"><strong>Arma:</strong> ${nombresArmas[arma]} | <strong>Objetivo:</strong> TA-${ta}</p>
            <p style="font-size: 15px; margin: 8px 0;"><strong>Dado:</strong> ${totalDados}${textoLog} | <strong>Cálculo:</strong> ${totalDados} + ${bo} (BO) - ${bd} (BD)</p>
            <p style="font-size: 18px; margin: 10px 0;">Total en Tabla de Armas: <strong>${resultadoTabla}</strong></p>
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
