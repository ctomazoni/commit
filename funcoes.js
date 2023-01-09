var hashes = [];
function criarNomeBranch() {
	if (document.getElementById('branch').value == 'dev') {
		document.getElementById('new_branch').value = 'SO' + document.getElementById('nr_os').value;
	} else {
		document.getElementById('new_branch').value = document.getElementById('branch').value + '-SO' + document.getElementById('nr_os').value;
	}
	document.getElementById('criar').value = 'Atualizar nome da branch';
}
function getTextAndCopy(num) {
	return '<input type="text" id="'+num+'"><input type="button" class="copy" onclick="copiar('+num+');" value="Copiar"><br>';
}
function getHashAndRemove(num) {
	return '<input type="text" id="hash'+num+'" disabled><input type="button" class="remove" onclick="removerHash('+num+');" value="Remover hash"><br>';
}
function getCommit(isAmend) {
	return 'git commit' + (isAmend ? ' --amend' : '') + ' -m "[SO-'
		+document.getElementById('nr_os').value+'] '
		+document.getElementById('type').value+'('
		+document.getElementById('project').value+'): '
		+document.getElementById('description').value+'"';
}
function gerarComandos() {
	var comandos = [];
	comandos.push('git fetch');
	comandos.push('git checkout ' + document.getElementById('branch').value);
	comandos.push('git pull origin ' + document.getElementById('branch').value);
	comandos.push('git checkout -b ' + document.getElementById('new_branch').value);
	if (document.getElementById('cherry_pick').checked) {
		for (var i = 0; i < hashes.length; i++) {
			comandos.push('git cherry-pick ' + document.getElementById('hash' + i).value);
			if (document.getElementById('amend').checked) {
				comandos.push(getCommit(true));
			}
		}
	} else {
		comandos.push(getCommit(document.getElementById('amend').checked));
	}
	comandos.push('git push --set-upstream origin ' + document.getElementById('new_branch').value);
	apresentarComandos(comandos);
	validarTipoCommit();
	document.getElementById('gerar').value = 'Atualizar comandos';
}
function apresentarComandos(comandos) {
	document.getElementById('result').innerHTML = '';
	for (var i = 0; i < comandos.length; i++) {
		document.getElementById('result').innerHTML += getTextAndCopy(i + 1);
	}
	for (var i = 0; i < comandos.length; i++) {
		document.getElementById(i + 1).value = comandos[i];
	}
}
function validarTipoCommit() {
	if (document.getElementById('type').value == '---') {
		alert('Informe o tipo do commit.');
	}
}
function copiar(id) {
	document.getElementById(id).select();
	document.execCommand('copy');
	document.getElementById(id).classList.add('copied');
}
function exibirHashes() {
	if (document.getElementById('cherry_pick').checked) {
		document.getElementById('hashes').classList.add('visible');
	} else {
		document.getElementById('hashes').classList.remove('visible');
	}
}
function inserirHash(hash) {
	hashes.push(document.getElementById('hash').value);
	document.getElementById('hash').value = '';
	listarHashes();
}
function listarHashes() {
	document.getElementById('hashList').innerHTML = '';
	for (var i = 0; i < hashes.length; i++) {
		document.getElementById('hashList').innerHTML += getHashAndRemove(i);
	}
	for (var i = 0; i < hashes.length; i++) {
		document.getElementById('hash' + i).value = hashes[i];
	}
}
function removerHash(num) {
	var index = hashes.indexOf(document.getElementById('hash'+num).value);
	if (index >= 0) {
		hashes.splice(index, 1);
	}
	listarHashes();
}