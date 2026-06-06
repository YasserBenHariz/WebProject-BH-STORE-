        function switchTab(tabName) {
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));

            document.getElementById(tabName).classList.add('active');

            event.target.classList.add('active');
        }

        
        function openDeleteModal(userId, userName) {
            document.getElementById('deleteUserId').value = userId;
            document.getElementById('deleteMessage').textContent = `Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action ne peut pas être annulée.`;
            document.getElementById('deleteModal').style.display = 'block';
        }

        function closeDeleteModal() {
            document.getElementById('deleteModal').style.display = 'none';
        }

        
        function openDeleteOrderModal(orderId, orderNumber) {
            document.getElementById('deleteOrderId').value = orderId;
            document.getElementById('deleteOrderMessage').textContent = `Êtes-vous sûr de vouloir supprimer la commande #${orderId} ? Cette action ne peut pas être annulée.`;
            document.getElementById('deleteOrderModal').style.display = 'block';
        }

        function closeDeleteOrderModal() {
            document.getElementById('deleteOrderModal').style.display = 'none';
        }

        
        function openDeleteProductModal(productId, productName) {
            document.getElementById('deleteProductId').value = productId;
            document.getElementById('deleteProductMessage').textContent = `Êtes-vous sûr de vouloir supprimer "${productName}" ? Cette action ne peut pas être annulée.`;
            document.getElementById('deleteProductModal').style.display = 'block';
        }

        function closeDeleteProductModal() {
            document.getElementById('deleteProductModal').style.display = 'none';
        }

        
        window.onclick = function(event) {
            const userModal = document.getElementById('deleteModal');
            const orderModal = document.getElementById('deleteOrderModal');
            const productModal = document.getElementById('deleteProductModal');
            if (event.target.id === 'deleteModal') {
                userModal.style.display = 'none';
            }
            if (event.target.id === 'deleteOrderModal') {
                orderModal.style.display = 'none';
            }
            if (event.target.id === 'deleteProductModal') {
                productModal.style.display = 'none';
            }
        }

        
        function previewProductImage(event) {
            const file = event.target.files[0];
            const preview = document.getElementById('productImagePreview');
            const previewImg = document.getElementById('productImagePreviewImg');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.style.display = 'none';
            }
        }
