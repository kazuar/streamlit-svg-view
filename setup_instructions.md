# SVG Animation Control Component Setup

## Installation and Setup

1. **Install Python dependencies:**
   ```bash
   uv sync
   ```

2. **Install frontend dependencies:**
   ```bash
   cd streamlit_svg_view/frontend
   npm install
   ```

## Development Mode

1. **Start the frontend development server:**
   ```bash
   cd streamlit_svg_view/frontend
   npm start
   ```
   This will start the React development server on `http://localhost:3001`

2. **Run the Streamlit example (in a separate terminal):**
   ```bash
   streamlit run example.py
   ```

## Production Build

1. **Build the frontend for production:**
   ```bash
   cd streamlit_svg_view/frontend
   npm run build
   ```

2. **Update the component to use production build:**
   Edit `streamlit_svg_view/__init__.py` and change `_RELEASE = False` to `_RELEASE = True`

## Usage

The component provides three controls for SVG animations:

- **Play**: Start or resume animations
- **Pause**: Pause currently running animations  
- **Restart**: Reset animations to the beginning

```python
import streamlit as st
from streamlit_svg_view import svg_view

# Your animated SVG
svg_content = '''
<svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="50" fill="blue">
        <animate attributeName="r" values="50;80;50" dur="2s" repeatCount="indefinite"/>
    </circle>
</svg>
'''

# Display with controls
result = svg_view(svg_content, width=250, height=250)
st.write("Animation state:", result)
```

## Component Features

- Cross-browser SVG animation control
- Responsive design
- Real-time state feedback to Streamlit
- Support for multiple animation types (`animate`, `animateTransform`, `animateMotion`)
- Error handling for unsupported browsers/features