<script>
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import { currentUser } from '$lib/stores/auth.store';
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		addExpense,
		getExpensesByUser,
		deleteExpense,
		updateExpense
	} from '$lib/services/expense.service';

	import {
		Plus,
		Trash2,
		Wallet,
		Calendar,
		FileText,
		Tag,
		IndianRupee,
		Pencil
	} from 'lucide-svelte';

	let expenses = $state([]);
	let loading = $state(false);
	let error = $state('');
	let success = $state('');
	let editingId = $state(null);

	let title = $state('');
	let category = $state('');
	let amount = $state('');
	let expenseDate = $state('');
	let notes = $state('');

	let totalExpenses = $derived(
		expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
	);

	function formatCurrency(value) {
		return `₹${Number(value || 0).toLocaleString('en-IN')}`;
	}

	async function loadExpenses() {
		const user = get(currentUser);
		if (!user) return;

		try {
			loading = true;
			error = '';
			expenses = await getExpensesByUser(user.uid);
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function resetForm() {
		editingId = null;
		title = '';
		category = '';
		amount = '';
		expenseDate = '';
		notes = '';
	}

	function handleEditExpense(expense) {
		editingId = expense.id;
		title = expense.title || '';
		category = expense.category || '';
		amount = expense.amount || '';
		expenseDate = expense.expenseDate || '';
		notes = expense.notes || '';
		success = '';
		error = '';
	}

	async function handleSubmitExpense() {
		error = '';
		success = '';

		const user = get(currentUser);

		if (!user) {
			error = 'Please login again';
			return;
		}

		if (!title || !category || !amount || !expenseDate) {
			error = 'Title, category, amount and date are required';
			return;
		}

		if (Number(amount) <= 0) {
			error = 'Amount must be greater than 0';
			return;
		}

		try {
			loading = true;

			const expenseData = {
				userId: user.uid,
				title,
				category,
				amount: Number(amount),
				expenseDate,
				notes
			};

			if (editingId) {
				await updateExpense(editingId, expenseData);
				success = 'Expense updated successfully';
			} else {
				await addExpense(expenseData);
				success = 'Expense added successfully';
			}

			resetForm();
			await loadExpenses();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleDeleteExpense(expenseId) {
		if (!confirm('Are you sure you want to delete this expense?')) return;

		try {
			loading = true;
			error = '';
			await deleteExpense(expenseId);
			await loadExpenses();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const unsubscribe = currentUser.subscribe((user) => {
			if (user) loadExpenses();
		});

		return () => unsubscribe();
	});
</script>

<AppShell userEmail={$currentUser?.email || 'user@example.com'}>
	<div class="mb-8">
		<h2 class="text-3xl font-bold text-slate-900">Expenses</h2>
		<p class="mt-1 text-slate-500">Track and manage business expenses</p>
	</div>

	<div class="grid gap-6 xl:grid-cols-3">
		<div class="rounded-2xl bg-white p-6 shadow-sm">
			<div class="mb-6 flex items-center gap-3">
				<div class="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
					<Wallet size={22} />
				</div>
				<div>
					<h3 class="text-xl font-bold text-slate-900">
						{editingId ? 'Edit Expense' : 'Add Expense'}
					</h3>
					<p class="text-sm text-slate-500">
						{editingId ? 'Update selected expense' : 'Record a new expense'}
					</p>
				</div>
			</div>

			{#if error}
				<p class="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>
			{/if}

			{#if success}
				<p class="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">{success}</p>
			{/if}

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmitExpense();
				}}
				class="space-y-4"
			>
				<div class="relative">
					<FileText class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						bind:value={title}
						placeholder="Expense Title"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<Tag class="absolute left-3 top-3 text-slate-400" size={19} />
					<select
						bind:value={category}
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Select Category</option>
						<option value="Rent">Rent</option>
						<option value="Salary">Salary</option>
						<option value="Transport">Transport</option>
						<option value="Utilities">Utilities</option>
						<option value="Food">Food</option>
						<option value="Office">Office</option>
						<option value="Marketing">Marketing</option>
						<option value="Other">Other</option>
					</select>
				</div>

				<div class="relative">
					<IndianRupee class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						type="number"
						min="1"
						bind:value={amount}
						placeholder="Amount"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<Calendar class="absolute left-3 top-3 text-slate-400" size={19} />
					<input
						type="date"
						bind:value={expenseDate}
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div class="relative">
					<FileText class="absolute left-3 top-3 text-slate-400" size={19} />
					<textarea
						bind:value={notes}
						placeholder="Notes"
						rows="3"
						class="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
					></textarea>
				</div>

				<div class="flex gap-3">
					<button
						type="submit"
						disabled={loading}
						class="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
					>
						<Plus size={18} />
						{loading ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
					</button>

					{#if editingId}
						<button
							type="button"
							onclick={resetForm}
							class="rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-200"
						>
							Cancel
						</button>
					{/if}
				</div>
			</form>
		</div>

		<div class="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h3 class="text-xl font-bold text-slate-900">Expense List</h3>
					<p class="text-sm text-slate-500">Total Expenses: {expenses.length}</p>
				</div>

				<div class="rounded-xl bg-red-50 px-4 py-3 text-right">
					<p class="text-xs text-red-500">Total Amount</p>
					<p class="text-xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
				</div>
			</div>

			{#if loading}
				<p class="text-slate-500">Loading expenses...</p>
			{:else if expenses.length === 0}
				<div class="rounded-2xl border border-dashed p-10 text-center">
					<Wallet class="mx-auto text-slate-400" size={42} />
					<h4 class="mt-4 text-lg font-bold text-slate-900">No expenses found</h4>
					<p class="mt-1 text-slate-500">Add your first expense to get started.</p>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="border-b text-sm text-slate-500">
								<th class="py-3">Title</th>
								<th class="py-3">Category</th>
								<th class="py-3">Amount</th>
								<th class="py-3">Date</th>
								<th class="py-3 text-right">Action</th>
							</tr>
						</thead>

						<tbody>
							{#each expenses as expense (expense.id)}
								<tr class="border-b text-sm">
									<td class="py-4 font-semibold text-slate-900">{expense.title}</td>
									<td class="py-4 text-slate-600">{expense.category}</td>
									<td class="py-4 font-semibold text-slate-900">
										{formatCurrency(expense.amount)}
									</td>
									<td class="py-4 text-slate-600">{expense.expenseDate}</td>
									<td class="py-4 text-right">
										<div class="flex justify-end gap-2">
											<button
												type="button"
												onclick={() => handleEditExpense(expense)}
												class="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
												title="Edit Expense"
											>
												<Pencil size={17} />
											</button>

											<button
												type="button"
												onclick={() => handleDeleteExpense(expense.id)}
												class="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
												title="Delete Expense"
											>
												<Trash2 size={17} />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</AppShell>