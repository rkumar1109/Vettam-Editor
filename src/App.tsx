// In Editor.tsx
import StarterKit from '@tiptap/starter-kit';
import { PageBreak } from './components/PageBreak';
import { Header, Footer } from './components/HeaderFooter';
import '../styles.scss'
import { TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import Underline from '@tiptap/extension-underline'
import MenuBar from './components/MenuBar';

export default function App(){
  const extensions = [TextStyle, StarterKit, Underline, PageBreak, Header, Footer];


function splitContentIntoPages(html: string): string[] {
  // Split by <hr data-page-break="true">
  return html.split(/<hr[^>]*data-page-break=["']?true["']?[^>]*>/gi);
}
const editor = useEditor({
    extensions: [
      StarterKit,
      PageBreak,
      Header,
      Footer,
    ],
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
      <header data-header>Case: Smith v. Jones</header>
      <p>This is page 1 content…</p>
      <hr data-page-break />
      <p>New content on page 2…</p>
      <footer data-footer>Page © 2025</footer>
    `
  })
  return (
    <div>
      {editor && <MenuBar editor={editor} />}
    {editor && <EditorContent editor={editor} />}
    </div>
  )
}

