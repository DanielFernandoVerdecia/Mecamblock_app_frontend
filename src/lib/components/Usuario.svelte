<script lang="ts">
  import { onMount } from 'svelte';

  // Clase Usuario
  export class Usuario {
    id: number;
    nombre: string;
    apellidos: string;

    constructor(nombre: string, apellidos: string) {
      this.id = Date.now();
      this.nombre = nombre;
      this.apellidos = apellidos;
    }
  }

  let usuarios: Usuario[] = [];
  let nombre = '';
  let apellidos = '';
  let editando = false;
  let idEditando: number | null = null;

  // Cargar desde localStorage
  onMount(() => {
    const data = localStorage.getItem('usuarios');
    if (data) usuarios = JSON.parse(data);
  });

  function guardarLocal() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }

  function agregarUsuario() {
    if (!nombre || !apellidos) return;

    const nuevo = new Usuario(nombre, apellidos);
    usuarios = [...usuarios, nuevo];
    guardarLocal();
    limpiarFormulario();
  }

  function editarUsuario(id: number) {
    const u = usuarios.find(x => x.id === id);
    if (!u) return;
    nombre = u.nombre;
    apellidos = u.apellidos;
    editando = true;
    idEditando = id;
  }

  function actualizarUsuario() {
    if (idEditando === null) return;

    usuarios = usuarios.map(u => {
      if (u.id === idEditando) {
        return {
          ...u,
          nombre,
          apellidos
        };
      }
      return u;
    });

    guardarLocal();
    limpiarFormulario();
  }

  function eliminarUsuario(id: number) {
    usuarios = usuarios.filter(u => u.id !== id);
    guardarLocal();
  }

  function limpiarFormulario() {
    nombre = '';
    apellidos = '';
    editando = false;
    idEditando = null;
  }
</script>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 400px;
    margin-bottom: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
  }
  button {
    padding: 6px 10px;
    cursor: pointer;
  }
</style>


<form on:submit|preventDefault={editando ? actualizarUsuario : agregarUsuario}>
  <input type="text" placeholder="Nombre" bind:value={nombre} />
  <input type="text" placeholder="Apellidos" bind:value={apellidos} />

  <button type="submit">{editando ? 'Actualizar' : 'Registrar'}</button>
  {#if editando}
    <button type="button" on:click={limpiarFormulario}>Cancelar</button>
  {/if}
</form>

<table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Apellidos</th>
      <th>Acciones</th>
    </tr>
  </thead>

  <tbody>
    {#each usuarios as u}
      <tr>
        <td>{u.id}</td>
        <td>{u.nombre}</td>
        <td>{u.apellidos}</td>
        <td>
          <button on:click={() => editarUsuario(u.id)}>Editar</button>
          <button on:click={() => eliminarUsuario(u.id)}>Eliminar</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
