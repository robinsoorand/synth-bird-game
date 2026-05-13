const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace the game over screen contents
html = html.replace(/<div id="gameOverScreen"[\s\S]*?<script src="script.js">/, `<div id="gameOverScreen" class="hidden">
        <h1>Game Over</h1>
        <p>Score: <span id="finalScore">0</span></p>
        <p>Best: <span id="bestScore">0</span></p>
        <p>Total XP: <span id="cumulativeScoreDisplay">0</span></p>

        <label style="color: #00ffff; font-size: 10px; display: block; margin-top: 5px;">
            <input type="checkbox" id="devModeToggle"> Dev Mode (Unlock All)
        </label>

        <div style="display: flex; gap: 10px;">
            <div id="birdSelection" style="flex: 1;">
                <h2>BIRD</h2>
                <div class="bird-grid">
                    <div class="bird-option selected" data-index="0">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>0</span></div>
                    </div>
                    <div class="bird-option" data-index="1">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>5</span></div>
                    </div>
                    <div class="bird-option" data-index="2">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>10</span></div>
                    </div>
                    <div class="bird-option" data-index="3">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>15</span></div>
                    </div>
                    <div class="bird-option" data-index="4">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>25</span></div>
                    </div>
                    <div class="bird-option" data-index="5">
                        <canvas class="bird-preview-canvas" width="40" height="40"></canvas>
                        <div class="bird-lock">🔒<br><span>50</span></div>
                    </div>
                </div>
            </div>

            <div id="levelSelection" style="flex: 1;">
                <h2>LEVEL</h2>
                <div class="level-grid">
                    <div class="level-option selected" data-index="0">
                        <div class="level-name">0</div>
                        <div class="level-lock">🔒<br><span>0</span></div>
                    </div>
                    <div class="level-option" data-index="1">
                        <div class="level-name">1</div>
                        <div class="level-lock">🔒<br><span>10</span></div>
                    </div>
                    <div class="level-option" data-index="2">
                        <div class="level-name">2</div>
                        <div class="level-lock">🔒<br><span>25</span></div>
                    </div>
                    <div class="level-option" data-index="3">
                        <div class="level-name">3</div>
                        <div class="level-lock">🔒<br><span>50</span></div>
                    </div>
                    <div class="level-option" data-index="4">
                        <div class="level-name">4</div>
                        <div class="level-lock">🔒<br><span>150</span></div>
                    </div>
                    <div class="level-option" data-index="5">
                        <div class="level-name">5</div>
                        <div class="level-lock">🔒<br><span>500</span></div>
                    </div>
                </div>
            </div>
        </div>

        <button id="restartButton">Restart</button>
    </div>
    <script src="script.js">`);

fs.writeFileSync('index.html', html);
