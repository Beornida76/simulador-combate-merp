document.getElementById('roll-btn').addEventListener('click', function() {
    // 1. Obtener los valores de los cuadros
    const bo = parseInt(document.getElementById('bo').value) || 0;
    const bd = parseInt(document.getElementById('bd').value) || 0;
    const ta = parseInt(document.getElementById('ta').value) || 1;
    
    const diceContainer = document.getElementById('dice-container');
    const resultBox = document.getElementById('result-box');
    
    // 2. Activar la animación del dado
    diceContainer.style.display = 'block';
    diceContainer.classList.add('spinning');
    resultBox.style.display = 'none';
    
    // 3. El dado gira por 1 segundo (1000 milisegundos) y luego muestra el resultado
    setTimeout(() => {
        diceContainer.classList.remove('spinning'); // Detener animación
        
        // --- LÓGICA DE DADOS MERP ---
        let dado = Math.floor(Math.random() * 100) + 1;
        let totalDados = dado;
        let logTiradas = [dado];
        
        // REGLA DE TIRADA ABIERTA (96 - 100)
        while (dado >= 96) {
            dado = Math.floor(Math.random() * 100) + 1;
            totalDados += dado;
            logTiradas.push(dado);
        }
        
        // Calcular resultado final en la tabla
        let resultadoTabla = totalDados + bo - bd;
        
        // 4. Mostrar el número final en el dado físico
        diceContainer.innerText = totalDados;
        
        // 5. Imprimir el desglose del combate en la pantalla
        let textoLog = logTiradas.length > 1 ? ` (Tirada Abierta: ${logTiradas.join(' + ')})` : '';
        
        resultBox.innerHTML = `
            <h3>⚔️ Resumen del Enfrentamiento ⚔️</h3>
            <p><strong>Resultado del dado:</strong> ${totalDados}${textoLog}</p>
            <p><strong>Cálculo:</strong> ${totalDados} (Dados) + ${bo} (BO) - ${bd} (BD)</p>
            <hr style="border-color: #8b7355;">
            <p style="font-size: 22px; color: #ffcc00;"><strong>Total en Tabla: ${resultadoTabla}</strong></p>
            <p><em>👉 Busca el resultado ${resultadoTabla} en la tabla de tu arma contra Armadura TA-${ta}.</em></p>
        `;
        resultBox.style.display = 'block';
        
    }, 1000);
});
