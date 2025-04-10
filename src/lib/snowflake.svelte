<!-- ContainedSnowfall.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';

  // 雪花配置参数
  export let snowflakeCount = 30;   // 雪花数量
  export let minSize = 12;          // 最小尺寸（字体大小）
  export let maxSize = 24;          // 最大尺寸（字体大小）
  export let minSpeed = 1;          // 最小速度
  export let maxSpeed = 2.5;        // 最大速度
  export let wind = 0;              // 风力因素
  export let zIndex = 5;            // 雪花层级

  // 雪花字符数组
  const snowflakeChars = ['❄', '❅', '❆', '✻', '✼'];
  
  let snowflakes = [];              // 存储雪花数据
  let containerRef;                 // 容器引用
  let containerWidth;               // 容器宽度
  let containerHeight;              // 容器高度
  let animationFrameId;             // 动画帧ID
  let mounted = false;              // 组件是否已挂载
  
  // 生成雪花
  function generateSnowflakes() {
    if (!containerRef || !mounted) return;
    
    snowflakes = [];
    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        id: i,
        x: Math.random() * containerWidth,
        y: Math.random() * containerHeight,
        size: minSize + Math.random() * (maxSize - minSize),
        speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
        opacity: 0.7 + Math.random() * 0.3,
        wobble: Math.random() * 2 * Math.PI,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1, // 正负旋转速度
        char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
      });
    }
  }
  
  // 动画函数 - 更新雪花位置
  function animateSnowflakes() {
    if (!mounted) return;
    
    snowflakes = snowflakes.map(flake => {
      // 水平摆动
      flake.x += Math.sin(flake.wobble) * 0.3 + wind * 0.1;
      flake.wobble += 0.01;
      
      // 垂直下落
      flake.y += flake.speed;
      
      // 旋转雪花
      flake.rotation += flake.rotationSpeed;
      
      // 当雪花落到底部时重置位置
      if (flake.y > containerHeight) {
        return {
          ...flake,
          x: Math.random() * containerWidth,
          y: -maxSize,
          size: minSize + Math.random() * (maxSize - minSize),
          speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
          char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)]
        };
      }
      
      // 处理水平边界
      if (flake.x < -maxSize) {
        flake.x = containerWidth;
      } else if (flake.x > containerWidth) {
        flake.x = -maxSize;
      }
      
      return flake;
    });
    
    animationFrameId = requestAnimationFrame(animateSnowflakes);
  }

  // 更新容器尺寸
  function updateContainerDimensions() {
    if (!containerRef) return;
    
    const rect = containerRef.getBoundingClientRect();
    containerWidth = rect.width;
    containerHeight = rect.height;
  }
  
  // 组件挂载时初始化
  onMount(() => {
    mounted = true;
    
    if (containerRef) {
      updateContainerDimensions();
      generateSnowflakes();
      animationFrameId = requestAnimationFrame(animateSnowflakes);
      
      // 监听容器大小变化
      const resizeObserver = new ResizeObserver(() => {
        updateContainerDimensions();
        generateSnowflakes();
      });
      
      resizeObserver.observe(containerRef);
      
      // 监听窗口大小变化
      const handleWindowResize = () => {
        updateContainerDimensions();
        generateSnowflakes();
      };
      
      window.addEventListener('resize', handleWindowResize);
      
      return () => {
        mounted = false;
        resizeObserver.disconnect();
        window.removeEventListener('resize', handleWindowResize);
        cancelAnimationFrame(animationFrameId);
      };
    }
  });
  
  // 组件销毁时清理
  onDestroy(() => {
    mounted = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });
</script>

<div bind:this={containerRef} class="snowfall-wrapper">
  <div class="snowfall-overlay" style="z-index: {zIndex};">
    {#each snowflakes as flake (flake.id)}
      <div 
        class="snowflake"
        style="
          transform: translate({flake.x}px, {flake.y}px) rotate({flake.rotation}deg);
          font-size: {flake.size}px;
          opacity: {flake.opacity};
        "
      >{flake.char}</div>
    {/each}
  </div>
  <div class="content-container">
    <slot></slot>
  </div>
</div>

<style>
  .snowfall-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .snowfall-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* 让鼠标事件穿透雪花层 */
  }
  
  .snowflake {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
    pointer-events: none;
    will-change: transform;
    text-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  }
  
  .content-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10; /* 确保内容显示在适当的层级 */
  }
</style>
