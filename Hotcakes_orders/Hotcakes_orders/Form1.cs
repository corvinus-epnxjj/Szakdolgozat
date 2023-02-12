using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Hotcakes.CommerceDTO.v1;
using Hotcakes.CommerceDTO.v1.Client;
using Hotcakes.CommerceDTO.v1.Contacts;
using Hotcakes.CommerceDTO.v1.Orders;
using Newtonsoft.Json;

namespace Hotcakes_orders
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            GetOrders();
        }

        private void createOrderButton_Click(object sender, EventArgs e)
        {
            string url = "http://www.dnndev.me";
            string key = "1-04ef5d8f-9490-4c54-b45a-a449865431cf";

            Api proxy = new Api(url, key);

            // create a new order object
            var order = new OrderDTO();

            // add billing information
            order.BillingAddress = new AddressDTO
            {
                AddressType = AddressTypesDTO.Billing,
                City = "West Palm Beach",
                CountryBvin = "BF7389A2-9B21-4D33-B276-23C9C18EA0C0",
                FirstName = "John",
                LastName = "Dough",
                Line1 = "319 N. Clematis Street",
                Line2 = "Suite 600",
                Phone = "561-228-5319",
                PostalCode = "33401",
                RegionBvin = "7EBE4F07-A844-47B8-BDA8-863DDDF5C778"
            };

            // add at least one line item
            order.Items = new List<LineItemDTO>();
            order.Items.Add(new LineItemDTO
            {
                ProductId = "dfcae0ee-8bcf-4321-8b31-7883b5434285",
                Quantity = 1
            });

            // add the shipping address
            order.ShippingAddress = new AddressDTO();
            order.ShippingAddress = order.BillingAddress;
            order.ShippingAddress.AddressType = AddressTypesDTO.Shipping;

            // specify who is creating the order
            order.UserEmail = "info@hotcakescommerce.com";
            order.UserID = "1";

            // call the API to create the order
            ApiResponse<OrderDTO> response = proxy.OrdersCreate(order);

            GetOrders();
        }

        private void deleteOrderButton_Click(object sender, EventArgs e)
        {
            string url = "http://www.dnndev.me";
            string key = "1-04ef5d8f-9490-4c54-b45a-a449865431cf";

            Api proxy = new Api(url, key);

            // specify the order to delete
            int rowIndex = ordersDataGridView.CurrentCell.RowIndex;
            int columnIndex = ordersDataGridView.CurrentCell.ColumnIndex;

            var orderId = ordersDataGridView[columnIndex, rowIndex].Value.ToString();

            // call the API to delete the order
            ApiResponse<bool> response = proxy.OrdersDelete(orderId);

            GetOrders();
        }

        public void GetOrders()
        {
            string url = "http://www.dnndev.me";
            string key = "1-04ef5d8f-9490-4c54-b45a-a449865431cf";

            Api proxy = new Api(url, key);

            // call the API to find all orders in the store
            ApiResponse<List<OrderSnapshotDTO>> response = proxy.OrdersFindAll();
            string json = JsonConvert.SerializeObject(response);

            ApiResponse<List<OrderSnapshotDTO>> deserializedResponse = JsonConvert.DeserializeObject<ApiResponse<List<OrderSnapshotDTO>>>(json);

            DataTable dt = new DataTable();
            dt.Columns.Add("Id", typeof(int));
            dt.Columns.Add("bvin", typeof(string));
            dt.Columns.Add("FirstName", typeof(string));
            dt.Columns.Add("StoreId", typeof(long));

            foreach (OrderSnapshotDTO item in deserializedResponse.Content)
            {
                dt.Rows.Add(item.Id, item.bvin, item.BillingAddress.FirstName, item.StoreId);
            }

            ordersDataGridView.DataSource = dt;
        }
    }
}
