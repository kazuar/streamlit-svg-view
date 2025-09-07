import streamlit as st
from streamlit_svg_view import svg_view

st.set_page_config(page_title="SVG Animation Control Demo", layout="wide")

st.title("SVG Animation Control Component Demo")
st.write("This component allows you to control SVG animations with play, pause, and restart buttons.")

# Example 1: Simple animated circle
st.subheader("Example 1: Animated Circle")
circle_svg = '''
<svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="30" fill="blue">
        <animate attributeName="r" values="30;60;30" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="fill" values="blue;red;green;blue" dur="3s" repeatCount="indefinite"/>
    </circle>
</svg>
'''

result1 = svg_view(circle_svg, width=250, height=250, key="circle")
st.write("Current state:", result1)

# Example 2: Moving rectangle
st.subheader("Example 2: Moving Rectangle")
rect_svg = '''
<svg width="300" height="100" viewBox="0 0 300 100">
    <rect x="0" y="25" width="50" height="50" fill="orange">
        <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0;250,0;0,0"
            dur="4s"
            repeatCount="indefinite"/>
    </rect>
</svg>
'''

result2 = svg_view(rect_svg, width=350, height=150, key="rectangle")
st.write("Current state:", result2)

# Example 3: Complex animation with multiple elements
st.subheader("Example 3: Complex Animation")
complex_svg = '''
<svg width="400" height="200" viewBox="0 0 400 200">
    <g>
        <!-- Rotating star -->
        <polygon points="200,50 210,80 240,80 218,100 228,130 200,112 172,130 182,100 160,80 190,80"
                 fill="gold" stroke="orange" stroke-width="2">
            <animateTransform
                attributeName="transform"
                type="rotate"
                values="0 200 100;360 200 100"
                dur="5s"
                repeatCount="indefinite"/>
        </polygon>
        
        <!-- Bouncing balls -->
        <circle cx="100" cy="150" r="15" fill="red">
            <animate attributeName="cy" values="150;50;150" dur="2s" repeatCount="indefinite"/>
        </circle>
        
        <circle cx="300" cy="150" r="15" fill="blue">
            <animate attributeName="cy" values="150;50;150" dur="2s" begin="1s" repeatCount="indefinite"/>
        </circle>
        
        <!-- Pulsing background -->
        <circle cx="200" cy="100" r="80" fill="lightblue" opacity="0.3">
            <animate attributeName="r" values="80;120;80" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite"/>
        </circle>
    </g>
</svg>
'''

result3 = svg_view(complex_svg, width=450, height=250, key="complex")
st.write("Current state:", result3)

# Example 4: Custom button colors
st.subheader("Example 4: Custom Button Colors")
st.write("You can customize the colors of the control buttons:")

# Pink/Purple theme
pink_svg = '''
<svg width="200" height="150" viewBox="0 0 200 150">
    <rect x="50" y="50" width="100" height="50" fill="hotpink" rx="10">
        <animate attributeName="width" values="100;150;100" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="fill" values="hotpink;mediumpurple;hotpink" dur="2s" repeatCount="indefinite"/>
    </rect>
</svg>
'''

result4 = svg_view(
    pink_svg, 
    width=250, 
    height=200,
    play_color="rgba(255,20,147,0.8)",  # Deep pink
    pause_color="rgba(138,43,226,0.8)",  # Blue violet  
    restart_color="rgba(255,105,180,0.8)",  # Hot pink
    key="custom_colors"
)
st.write("Custom colors state:", result4)

# Instructions
st.subheader("Instructions")
st.write("""
- **Play**: Start or resume the SVG animations
- **Pause**: Pause the currently running animations  
- **Restart**: Reset animations to the beginning and start playing

The component returns a dictionary with:
- `is_playing`: Boolean indicating if animations are currently playing
- `action`: The last action performed (for tracking user interactions)

**Button Color Customization:**
You can customize button colors using CSS color formats:
- `play_color`: Color when ready to play (default: soft green)
- `pause_color`: Color when ready to pause (default: warm orange)
- `restart_color`: Color for restart button (default: purple-blue)

Example: `svg_view(svg_content, play_color="#ff6b6b", pause_color="#4ecdc4", restart_color="#45b7d1")`
""")

# Custom SVG input
st.subheader("Try Your Own SVG")
st.write("Paste your own animated SVG code below:")

custom_svg = st.text_area(
    "SVG Code",
    value=circle_svg,
    height=150,
    help="Paste your SVG code here. Make sure it includes animation elements like <animate> or <animateTransform>"
)

if custom_svg.strip():
    try:
        result_custom = svg_view(custom_svg, width=400, height=300, key="custom")
        st.write("Custom SVG state:", result_custom)
    except Exception as e:
        st.error(f"Error rendering custom SVG: {e}")