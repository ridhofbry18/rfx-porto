import sys
import json
import struct

def parse_glb(file_path):
    with open(file_path, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a GLB file")
            return
        
        version, length = struct.unpack('<II', f.read(8))
        
        # Read JSON chunk
        chunk_length, chunk_type = struct.unpack('<II', f.read(8))
        if chunk_type != b'JSON':
            print("First chunk is not JSON")
            return
            
        json_data = f.read(chunk_length).decode('utf-8')
        data = json.loads(json_data)
        
        print("Nodes found in GLB:")
        for i, node in enumerate(data.get('nodes', [])):
            name = node.get('name', f'Node_{i}')
            translation = node.get('translation', [0, 0, 0])
            print(f"- {name}: position={translation}")

if __name__ == '__main__':
    parse_glb(sys.argv[1])
