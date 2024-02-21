import React, { useState } from 'react';
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js';
import 'draft-js/dist/Draft.css';

const MyEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
  
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
  
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const blockType = currentBlock.getType();
  
    if (command === 'bold') {
      if (blockType === 'unstyled') {
        const newContentState = Modifier.replaceText(
          contentState,
          selection,
          '*',
          editorState.getCurrentInlineStyle(),
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          'insert-characters',
        );
        setEditorState(newEditorState);
        return 'handled';
      }
    } else if (command === 'header') {
      if (blockType === 'unstyled') {
        let textAfterHash = currentBlock.getText().substring(1);
        if (textAfterHash.startsWith(' ')) {
          textAfterHash = textAfterHash.substring(1);
        }
        const newContentState = Modifier.replaceText(
          contentState,
          selection,
          `${textAfterHash}`,
          editorState.getCurrentInlineStyle(),
        );
        const newEditorState = EditorState.push(
          editorState,
          newContentState,
          'insert-characters',
        );
        setEditorState(RichUtils.toggleBlockType(newEditorState, 'header-one'));
        return 'handled';
      }
    }
  
    return 'not-handled';
  };
  
  
  const saveContent = () => {
    const content = JSON.stringify(editorState.getCurrentContent().toJSON());
    localStorage.setItem('editorContent', content);
  };

  return (
    <div className="editor-container">
      <div style={{ marginBottom: '10px' }}>
       <h4>demo editor</h4>
        <button onClick={saveContent}>Save</button>
      </div>
      <div className="editor-wrapper">
        <Editor
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
        />
      </div>
    </div>
  );
};

export default MyEditor;
