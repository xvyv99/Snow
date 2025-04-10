<script lang='ts'>
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	
	let width = 300
	let height = 300
	export let color = '#333'
	export let background = '#fff'
	export let backgroundImage: string | null = null
	
	let canvas: HTMLCanvasElement 
	let context: CanvasRenderingContext2D | null = null
	let isDrawing: boolean
	let start: { x: number; y: number; }
	
	let t: number, l: number
	let container: HTMLElement
	let image: HTMLImageElement | null = null
	
	export function getCanvasData(): string {
		return canvas.toDataURL('image/png');
	}
	
	export function addText(text: string, x: number, y: number) {
		if (!context) return;
		
		context.font = '24px CustomFont';
		context.fillStyle = color;
		context.textAlign = 'center';
		context.fillText(text, x, y);
	}
	
	onMount(() => {
		context = canvas.getContext('2d')!
        if (context) {
		    context.lineWidth = 3
        }
		
		handleSize()
		updateCanvasSize()
		if (backgroundImage) {
			loadBackgroundImage()
		}
	})
	
	$: if(context) {
			context.strokeStyle = color
	}

	$: if (backgroundImage && browser) {
		loadBackgroundImage()
	}
	
	const loadBackgroundImage = () => {
		if (!backgroundImage || !browser) return
		
		console.log('Loading image:', backgroundImage)
		image = new Image()
		image.crossOrigin = 'anonymous'  // 添加跨域支持
		
		image.onload = () => {
			if (image) {
				console.log('Image loaded successfully:', image.width, 'x', image.height)
				drawBackground()
			}
		}
		
		image.onerror = (error) => {
			console.error('Error loading image:', error)
		}
		
		image.src = backgroundImage
	}

	const drawBackground = () => {
		if (!context || !image) {
			console.log('Cannot draw background:', { context: !!context, image: !!image })
			return
		}
		
		console.log('Drawing background, canvas size:', width, 'x', height)
		
		// 清除画布
		context.clearRect(0, 0, width, height)
		
		// 计算图片缩放比例以适应画布
		const scale = Math.max(width / image.width, height / image.height)
		const scaledWidth = image.width * scale
		const scaledHeight = image.height * scale
		
		// 居中绘制图片
		const x = (width - scaledWidth) / 2
		const y = (height - scaledHeight) / 2
		
		console.log('Drawing image at:', { x, y, scaledWidth, scaledHeight })
		
		context.drawImage(image, x, y, scaledWidth, scaledHeight)
	}
	
	const handleStart = (({ offsetX: x, offsetY: y }: { offsetX: number; offsetY: number }) => { 
		if(color === background) {
			context.clearRect(0, 0, width, height)
			drawBackground() // 清除时重绘背景
		} else {
			isDrawing = true
			start = { x, y }
		}
	})
	
	const handleEnd = () => { isDrawing = false }
	const handleMove = (({ offsetX: x1, offsetY: y1 }: { offsetX: number; offsetY: number }) => {
		if(!isDrawing) return
		
		const { x, y } = start
		context.beginPath()
		context.moveTo(x, y)
		context.lineTo(x1, y1)
		context.closePath()
		context.stroke()
		
		start = { x: x1, y: y1 }
	})

	const handleSize = () => {
		const { top, left } = canvas.getBoundingClientRect()
		t = top
		l = left
	}

	const updateCanvasSize = () => {
		if (container) {
			const newWidth = container.clientWidth
			const newHeight = container.clientHeight
			
			if (newWidth !== width || newHeight !== height) {
				width = newWidth
				height = newHeight
				console.log('Canvas size updated:', width, 'x', height)
				drawBackground() // 尺寸改变时重绘背景
			}
		}
	}
</script>

<svelte:window on:resize={updateCanvasSize} />

<div bind:this={container} style="width: 100%; height: 100%;">
	<canvas
		{width}
		{height}
		style:background
		bind:this={canvas} 
		on:mousedown={handleStart}	
		on:touchstart={e => {
			const { clientX, clientY } = e.touches[0]
			handleStart({
				offsetX: clientX - l,
				offsetY: clientY - t
			})
		}}	
		on:mouseup={handleEnd}				
		on:touchend={handleEnd}				
		on:mouseleave={handleEnd}
		on:mousemove={handleMove}
		on:touchmove={e => {
			const { clientX, clientY } = e.touches[0]
			handleMove({
				offsetX: clientX - l,
				offsetY: clientY - t
			})
		}}
	></canvas>
</div>

<style>
	div {
		position: relative;
	}
	canvas {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>