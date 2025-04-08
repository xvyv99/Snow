<script lang='ts'>
    let selected: number = 1;  // 初始时没有选中任何 div

    function selectDiv(index: number) {
        selected = index;  // 点击时更新选中项
    }

  import { onMount } from 'svelte';
  
  let snowContainer: HTMLElement;
  const snowflakeSymbols = ['❄', '❅', '❆', '✻', '✼'];
  let snowflakes = [];
  
  // 创建雪花对象
  function createSnowflake() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      symbol: snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)],
      size: Math.random() * 0.8 + 0.7,
      opacity: Math.random() * 0.3 + 0.7,
      duration: Math.random() * 12 + 8,
      col: Math.floor(Math.random() * 450) + 1,
      row: 1,
      swayAmplitude: Math.random() * 30 + 10,
      swayFrequency: Math.random() * 0.01 + 0.005,
      startPos: Math.random() * 100
    };
  }
  
  // 使用onMount确保在DOM渲染后执行
  onMount(() => {
    // 创建15片雪花
    for (let i = 0; i < 15; i++) {
      snowflakes.push(createSnowflake());
    }
    
    // 为每个雪花添加摆动动画
    snowflakes.forEach(flake => {
      // 这里我们模拟原始代码中的requestAnimationFrame逻辑
      const element = document.getElementById(`snowflake-${flake.id}`);
      if (element) {
        let startTime = Date.now();
        
        function sway() {
          const time = (Date.now() - startTime) / 1000;
          const swayX = Math.sin(time * flake.swayFrequency * 2 * Math.PI) * flake.swayAmplitude;
          element.style.transform = `translateX(${swayX}px)`;
          requestAnimationFrame(sway);
        }
        
        sway();
      }
    });
    
    // 监听动画完成事件，重置雪花位置
    const elements = document.querySelectorAll('.snowflake');
    elements.forEach(elem => {
      elem.addEventListener('animationiteration', () => {
        const id = elem.getAttribute('data-id');
        const flake = snowflakes.find(f => f.id === id);
        if (flake) {
          flake.col = Math.floor(Math.random() * 450) + 1;
          elem.style.gridColumn = flake.col.toString();
        }
      });
    });
  });

</script>

<style>
    #bd {
      width: 440px;

      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }

    .snow-container {
      /* 更深的冰蓝色背景 */
      background-color: #d0e9f5;
      /* 微妙的渐变，增强层次感 */
      background-image: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.4) 0%,
              rgba(208, 233, 245, 0.8) 50%,
              rgba(176, 216, 235, 0.9) 100%
      );
      /* 卡片基础样式 */
      padding-top: 20px;
      width: 440px;
      height: 500px;
      box-shadow: 0 6px 18px rgba(80, 160, 210, 0.2);
      position: relative;
      overflow: hidden;
    }

    /* 雪花容器 - 使用网格布局 */
    .snow-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(1px, 1fr));
      grid-auto-rows: 1px;
      pointer-events: none;
      z-index: 1;
    }

    .snowflake {
      grid-column: var(--col);
      grid-row: var(--row);
      justify-self: center;
      color: white;
      font-size: var(--size);
      user-select: none;
      pointer-events: none;
      animation: fall linear infinite;
      animation-duration: var(--duration);
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
      opacity: var(--opacity);
      transform: translateY(-100%);
    }

    @keyframes fall {
      to {
        transform: translateY(600px);
      }
    }

    @font-face {
      font-family: 'CustomFont';
      font-style: normal;
      font-weight: normal;
      src: url('/fonts/zt.woff') format('woff');
    }

    .art_text {
      font-family: 'CustomFont';
    }

    #mainSentence img {
      font-size: 30px;
    }

    #mainSentence {
      margin-top: 20%;
      font-size: 30px;
      cursor: pointer;
    }

    #dt {
      position: relative;
      top: 50px;
    }

    /* 内容区域 - 确保显示在雪花上方 */
    .content {
      position: relative;
      z-index: 2;
      padding-left: 20px;
      padding-right: 20px;
      height: 100%;
      user-select: none;
    }

     .hv {
       transition: all 0.3s ease;
       cursor: pointer;
       text-align: center;
       user-select: none;
     }

    .hv.active {
      transform: scale(1.3);
      /* 放大时稍微上移，避免遮挡下方内容 */
      transform-origin: bottom center;
    }

    .hv.inactive {
      transform: scale(0.9);
      opacity: 0.7;
    }

    .hv.active p {
      font-weight: bold; /* 放大时文字加粗 */
    }

</style>

<svelte:head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>冰趣卡</title>
</svelte:head>

<div id="bd">
  <!-- 雪花层 -->
<div class="snow-layer" bind:this={snowContainer}>
  {#each snowflakes as flake (flake.id)}
    <div 
      id="snowflake-{flake.id}"
      data-id={flake.id}
      class="snowflake"
      style="
        --size: {flake.size}em;
        --opacity: {flake.opacity};
        --duration: {flake.duration}s;
        --col: {flake.col};
        --row: {flake.row};
        left: {flake.startPos}%;
      "
    >
      {flake.symbol}
    </div>
  {/each}
</div>

  <!-- 内容层 -->
  <div class="snow-container">
    <div class="content">
      <h1 class='art_text' style="width: 100%;text-align: center">冰趣卡</h1>
      <div id="mainSentence" style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div class='art_text'>点击开启</div>
        <div class='art_text'>您的专属定制</div>
      </div>
      <div style="height: 200px;margin-top: 5%;display: flex;flex-direction: row;align-items: flex-end">
        <div style="border: 4px solid white;width: 450px;height: 200px;display: flex;align-items: flex-end">
          <div id="dt" style="width: 300px;display: flex;flex-direction: row;justify-content: space-around;align-items: flex-end">
            <div class="hv" class:active={selected === 0} class:inactive={selected != 0} on:click={() => selectDiv(0)}>
              <img src="651741447883_.pic_hd.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">文化主题</p>
            </div>
            <div class="hv" class:active={selected === 1} class:inactive={selected != 1} on:click={() => selectDiv(1)}>
              <img src="661741447885_.pic_hd.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">风景主题</p>
            </div>
            <div class="hv" class:active={selected === 2} class:inactive={selected != 2} on:click={() => selectDiv(2)}>
              <img src="671741447887_.pic_hd.jpg" alt="" width="60" height="100">
              <p class='art_text' style="margin: 0;text-align: center">名俗主题</p>
            </div>
          </div>
        </div>
        <div><img src="IMG_SEGMENT_20250405_120552.png" alt="" width="150" height="200" style="position: relative;right: 30px"></div>
      </div>
    </div>
  </div>
  <div style="margin-top: 20px">
    <div style="display: flex;flex-direction: row;justify-content: space-around;">
      <div>定制流程</div>

    </div>
  </div>
  <div style="margin-top: 15px">
    <div style="display: flex;flex-direction: row;justify-content: space-around;">
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="1" stroke="#1890ff" stroke-width="2"/>
            <path d="M4 8H20M8 4V8M12 4V8M16 4V8" stroke="#1890ff" stroke-width="2"/>
            <circle cx="12" cy="14" r="2" fill="#1890ff"/>
          </svg>
        </div>
        <div>
          选定模板
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V21M3 12H21" stroke="#52c41a" stroke-width="2" stroke-linecap="round"/>
            <path d="M18 6L6 18M6 6L18 18" stroke="#52c41a" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="12" r="3" stroke="#52c41a" stroke-width="2"/>
          </svg>
        </div>
        <div>
          个性化定制
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H5.5L8 16H18M8 16L6.5 9.5M18 16H21L18.5 9.5H8" stroke="#faad14" stroke-width="2" stroke-linecap="round"/>
            <circle cx="9" cy="19" r="1" fill="#faad14"/>
            <circle cx="18" cy="19" r="1" fill="#faad14"/>
            <path d="M9 9H12" stroke="#faad14" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          提交订单
        </div>
      </div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="8" width="16" height="10" rx="1" stroke="#722ed1" stroke-width="2"/>
            <path d="M18 8H22V14H18M18 14H14V18M18 14V18H22" stroke="#722ed1" stroke-width="2"/>
            <circle cx="7" cy="18" r="2" stroke="#722ed1" stroke-width="2"/>
            <circle cx="19" cy="18" r="2" stroke="#722ed1" stroke-width="2"/>
            <path d="M10 8H14" stroke="#722ed1" stroke-width="2"/>
          </svg>
        </div>
        <div>
          发货收货
        </div>
      </div>
    </div>
  </div>

  <div style="display: flex;justify-content: center;margin-top: 10px">
    <button style="font-family: 'CustomFont';color: white;font-size: larger;border:#ff1f1f;background-color: #ff2121;border-radius: 20px;width: 80%;height: 30px">
     点击定制
    </button>
  </div>
</div>

