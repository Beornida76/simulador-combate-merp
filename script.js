document.getElementById('roll-btn').addEventListener('click', function() {
    // 1. Obtener los valores ingresados por el usuario
    const bo = parseInt(document.getElementById('bo').value) || 0;
    const bd = parseInt(document.getElementById('bd').value) || 0;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    
    const diceContainer = document.getElementById('dice-container');
    const resultBox = document.getElementById('result-box');
    
    // Resetear textos y activar animación del dado girando
    diceContainer.innerText = "...";
    diceContainer.style.display = 'block';
    diceContainer.classList.add('spinning');
    resultBox.style.display = 'none';
    
    // El dado gira por 1 segundo simulando la tensión de la mesa
    setTimeout(() => {
        diceContainer.classList.remove('spinning'); // Parar animación
        
        // --- 🎲 SISTEMA DE DADOS MERP 🎲 ---
        let dadoOriginal = Math.floor(Math.random() * 100) + 1;
        let totalDados = dadoOriginal;
        let logTiradas = [dadoOriginal];
        
        // REGLA DE TIRADA ABIERTA (96 - 100)
        while (dadoOriginal >= 96) {
            dadoOriginal = Math.floor(Math.random() * 100) + 1;
            totalDados += dadoOriginal;
            logTiradas.push(dadoOriginal);
        }
        
        // Calcular el total que se buscaría en la hoja de tablas
        let resultadoTabla = totalDados + bo - bd;
        diceContainer.innerText = totalDados; // Mostrar número final en el dado visual

        // --- 📊 MOTOR DE LOOKUP DE TABLAS MERP ---
        let respuestaCombate = "";
        
        // Comprobar pifia de MERP (01-04 en el primer dado es fallo catastrófico)
        if (logTiradas[0] <= 4) {
            respuestaCombate = `
                <div style="color: #ff4d4d; font-size: 22px; font-weight: bold; margin-bottom: 10px;">💥 ¡¡PIFIA DE COMBATE!! 💥</div>
                <p>Has sacado un <strong>${logTiradas[0]} natural</strong> en los dados. Tropiezas con una raíz, pierdes el equilibrio o tu arma golpea un escudo de forma torpe. Quedas <strong>aturdido durante 1 asalto</strong> y sufres -20 a tu siguiente acción.</p>
            `;
        } else {
            // Si no es pifia, cruzamos los datos matemáticos de la tabla de Filo de MERP
            let pvDaño = 0;
            let rangoCritico = "Ninguno";
            let descCritico = "";

            if (resultadoTabla <= 40) {
                pvDaño = 0;
                descCritico = "El ataque es demasiado débil o impreciso. El arma resbala inofensivamente por la defensa.";
            } else if (resultadoTabla >= 41 && resultadoTabla <= 65) {
                if (ta <= 4) pvDaño = 5;       // Ropa / Sin armadura
                else if (ta <= 8) pvDaño = 3;  // Cuero
                else if (ta <= 12) pvDaño = 1; // Cuero endurecido / Malla ligera
                else pvDaño = 0;               // Malla pesada / Placas
            } else if (resultadoTabla >= 66 && resultadoTabla <= 85) {
                if (ta <= 4) pvDaño = 10;
                else if (ta <= 8) pvDaño = 7;
                else if (ta <= 12) pvDaño = 4;
                else if (ta <= 16) pvDaño = 2;
                else pvDaño = 0;
            } else if (resultadoTabla >= 86 && resultadoTabla <= 100) {
                if (ta <= 4) pvDaño = 15;
                else if (ta <= 8) pvDaño = 12;
                else if (ta <= 12) pvDaño = 9;
                else if (ta <= 16) pvDaño = 5;
                else pvDaño = 2;
            } else if (resultadoTabla >= 101 && resultadoTabla <= 115) {
                if (ta <= 4) { pvDaño = 18; rangoCritico = "A"; }
                else if (ta <= 8) { pvDaño = 15; rangoCritico = "A"; }
                else if (ta <= 12) { pvDaño = 11; rangoCritico = "A"; }
                else if (ta <= 16) { pvDaño = 7; }
                else { pvDaño = 4; }
            } else if (resultadoTabla >= 116 && resultadoTabla <= 130) {
                if (ta <= 4) { pvDaño = 22; rangoCritico = "B"; }
                else if (ta <= 8) { pvDaño = 19; rangoCritico = "A"; }
                else if (ta <= 12) { pvDaño = 14; rangoCritico = "A"; }
                else if (ta <= 16) { pvDaño = 11; rangoCritico = "A"; }
                else { pvDaño = 6; }
            } else if (resultadoTabla >= 131 && resultadoTabla <= 145) {
                if (ta <= 4) { pvDaño = 26; rangoCritico = "C"; }
                else if (ta <= 8) { pvDaño = 23; rangoCritico = "B"; }
                else if (ta <= 12) { pvDaño = 18; rangoCritico = "A"; }
                else if (ta <= 16) { pvDaño = 14; rangoCritico = "A"; }
                else { pvDaño = 10; rangoCritico = "A"; }
            } else { // 146 o más en tabla
                if (ta <= 4) { pvDaño = 32; rangoCritico = "E"; }
                else if (ta <= 8) { pvDaño = 28; rangoCritico = "D"; }
                else if (ta <= 12) { pvDaño = 23; rangoCritico = "C"; }
                else if (ta <= 16) { pvDaño = 19; rangoCritico = "B"; }
                else { pvDaño = 15; rangoCritico = "A"; }
            }

            // Textos inmersivos de críticos clásicos de Joc Internacional
            if (rangoCritico !== "Ninguno") {
                const tablaCriticos = {
                    "A": "⚔️ <strong>Crítico de Filo Rango A:</strong> Un corte rápido pero certero en el brazo. El defensor trastabilla sufriendo <span style='color:#ff4d4d;'>+3 PV extra</span> y un penalizador de <strong>-5</strong> a su próxima acción.",
                    "B": "🩸 <strong>Crítico de Filo Rango B:</strong> Tajo profundo en el muslo derecho. El enemigo pierde <span style='color:#ff4d4d;'>+5 PV extra</span>, empieza a <strong>sangrar (1 PV por asalto)</strong> y sufre un doloroso <strong>-10</strong> a toda actividad.",
                    "C": "🦴 <strong>Crítico de Filo Rango C:</strong> Impacto violento en el costado. Rompe una costilla menor. El enemigo sufre <span style='color:#ff4d4d;'>+8 PV extra</span>, queda <strong>Aturdido durante 1 asalto</strong> y sangra 1 PV/asalto.",
                    "D": "💀 <strong>Crítico de Filo Rango D:</strong> ¡Golpe tremendo! Tajo severo que desgarra la armadura. El defensor recibe <span style='color:#ff4d4d;'>+12 PV extra</span>, queda completamente <strong>Aturdido durante 2 asaltos</strong>, sangra 2 PV/asalto y recibe un masivo <strong>-20</strong> general.",
                    "E": "🦅 <strong>Crítico de Filo Rango E:</strong> ¡Impacto legendario! Una estocada magistral que derriba al oponente al suelo. Recibe <span style='color:#ff4d4d;'>+20 PV extra</span>, queda <strong>Aturdido durante 3 asaltos</strong>, sangra 3 PV/asalto y no podrá atacar en el siguiente turno."
                };
                descCritico = tablaCriticos[rangoCritico];
            } else {
                descCritico = "⚔️ Golpe limpio pero superficial. Sin efectos críticos añadidos.";
            }

            // Construir la respuesta final de daño
            respuestaCombate = `
                <div style="font-size: 28px; color: #ffcc00; font-weight: bold; margin-bottom: 15px;">
                    💥 Daño infligido: ${pvDaño} PV 💥
                </div>
                <div style="background-color: #252525; padding: 12px; border-radius: 6px; border-left: 4px solid #b71c1c; text-align: left; font-size: 16px;">
                    ${descCritico}
                </div>
            `;
        }
        
        // 5. Imprimir el desglose total en pantalla
        let textoLog = logTiradas.length > 1 ? ` <span style="color:#ffcc00;">(¡Tirada Abierta!: ${logTiradas.join(' + ')})</span>` : '';
        
        resultBox.innerHTML = `
            <h3 style="color:#ffcc00; border-bottom: 1px solid #8b7355; padding-bottom: 8px; margin-top: 0;">⚔️ Resultado del Ataque ⚔️</h3>
            <p style="font-size: 16px; margin: 8px 0;"><strong>Dado:</strong> ${totalDados}${textoLog} | <strong>Cálculo:</strong> ${totalDados} (Dados) + ${bo} (BO) - ${bd} (BD)</p>
            <p style="font-size: 15px; color: #aaaaaa; margin: 4px 0;">Objetivo equipado con Armadura Tipo TA-${ta}</p>
            <p style="font-size: 18px; margin: 10px 0;">Total en Tabla de Armas: <strong>${resultadoTabla}</strong></p>
            <hr style="border-color: #444; margin: 15px 0;">
            ${respuestaCombate}
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
