// Show the loading indicator
$("#loadingIndicator").show();

$.ajax({
    url: "https://localhost:7116/Testing/webtesting",
    method: "GET",
    success: function (response) {
        // Process the response data

        // Hide the loading indicator
        $("#loadingIndicator").hide();
    },
    error: function (error) {
        // Handle error

        // Hide the loading indicator
        $("#loadingIndicator").hide();
    }
});
var Login = new function () {
    var mThis = this;
    this.self = $("#Login");
    this.serviceName =
        /*LoginWebPage*/
        this.LoginBtn = $("#BtnCheckIn");
    this.RegisterLink = $("#RegisterLink");
    this.IndexPage = $(".LoginPage");
    this.inputEmail = $("#inputEmail");
    this.inputPassword = $("#inputPassword");
    this.RegisterPage = $(".register-form");
    this.btnbackLogin = $(".backLogin");
    this.RegisterAccount = $("#RegisterAccount");
    this.firstName = $("#firstName");
    this.lastName = $("#lastName");
    this.dob = $("#dob");
    this.email = $("#email");
    this.password = $("#password");
    this.maincontent = $("#maincontent");
    this.UsernameBar = $("#UsernameBar");
    this.Logoutfunction = $("#Logoutfunction");
    this.Profilefunction = $("#Profilefunction");
    this.Profile = $(".Profile");
    this.btnbackprofile = $("#btnbackprofile");
    this.userid = $("#userid");
    this.userposition = $("#userposition");
    this.FullName = $("#FullName");
    this.dob = $("#dobtxt");
    this.email = $("#emailtxt");
    this.profileImage = $("#profileImage");
    this.PricingContainer = $(".PricingContainer");
    this.Ordertaga = $("#Ordertaga");
    this.FeatureContainer = $(".FeatureContainer");
    this.HomeContainer = $(".HomeContainer");
    this.footer = $("#containfooter");
    this.PricingTab = $("#PricingTab");
    this.FeatureTab = $("#FeatureTab");
    this.HomeTab = $("#HomeTab");
    this.BtnPurchase = $("#BtnPurchase");
    this.AddItem = $("#AdminDashboard");
    this.historybough = $("#historybough");
    this.admindashboard = $(".admindashboardclass");
    this.addfooditem = $("#add-food-item");
    this.foodname = $("#food-name");
    this.foodprice = $("#food-price");
    this.foodimage = $("#food-image");
    this.faeyeslash = $(".fa-eye-slash");
    this.deletecardfood = $(".deletecardfood");
    this.Updatefooditem = $("#Update-food-item");
    this.containerOrder = $(".container-Order");
    this.pizzaimage = $("#pizzaimage");
    this.backmenu = $(".backmenu");
    this.Paymentcontain = $(".Paymentcontain");
    this.idhide = $("#idhide");
    this.backfood = $("#backfood");
    this.faeye = $(".fa-eye");
    this.userinformationlocation = $("#userinformationlocation");
    this.userinformationphone = $("#userinformationphone");
    this.userinformationemail = $("#userinformationemail");
    this.userinformationname = $("#userinformationname");
    this.SpecificNumOrder = $("#SpecificNumOrder");
    this.iconpurchase = $("#iconpurchase");
    this.PurchaseArea = $("#PurchaseArea");
    this.PaymentContainer = $(".PaymentContainer");
    this.OrderButton = $("#OrderButton");
    this.OrderHistory = $("#myTable");
    this.tablehistoryorder = $(".bootstrap5");



    this.Cleartify = function () {
        // Code executed when PricingTab is clicked
        mThis.IndexPage.hide();
        mThis.footer.show();
        mThis.admindashboard.hide();
        mThis.Paymentcontain.hide();
        mThis.HomeContainer.hide();
        mThis.HomeContainer.hide();
        mThis.RegisterPage.hide();
        mThis.admindashboard.hide();
        mThis.PricingContainer.hide();
        mThis.containerOrder.hide();
        mThis.PurchaseArea.hide();
        mThis.Profile.hide();
        mThis.PaymentContainer.hide();
        $(".bootstrap5").css("display", "none");
    }

    var spenum = function () {
        var obj = {};
        obj.userid = $("#userid").text();
        $.ajax({
            type: 'POST',
            url: '../../Testing/ordernum',
            data: obj,
            dataType: "json",
            success: function (response) {
                $("#SpecificNumOrder").text(response);
            }
        });
    };


    //LoginAction
    this.LoginBtn.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.IndexPage.show();

        var obj = {};
        obj.EmailDatas = mThis.inputEmail.val();
        obj.InputPasswords = mThis.inputPassword.val();

        $.ajax({
            type: 'POST',
            url: '../../Testing/Login',
            data: obj,
            datatype: "JSON",
            success: function (response) {
                if (response == "2") {
                    alertify.error("Please Input Emaile or Password");
                    mThis.inputEmail.val("");
                    mThis.inputPassword.val("");
                }
                else if (response == "0") {
                    alertify.error('Wrong Password or Email');
                    mThis.inputEmail.val("");
                    mThis.inputPassword.val("");
                }
                else {
                    alertify.success('Login Successed');
                    $("#maincontent").css("display", "flex");
                    mThis.Cleartify();
                    mThis.IndexPage.hide();
                    mThis.maincontent.show();
                    mThis.inputEmail.val("");
                    mThis.inputPassword.val("");
                    mThis.UsernameBar.text(response.fullName);
                    mThis.userid.text(response.id);
                    mThis.userposition.text(response.position);
                    mThis.HomeTab.trigger("click");
                    spenum();

                    if (mThis.userposition.text() == "Admin") {
                        mThis.AddItem.show();
                    }
                    else {
                        mThis.AddItem.hide();
                    }
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });


    // Call spenum whenever needed

    this.backmenu.on("click", function () {
        mThis.PricingTab.trigger("click");
    })
    this.faeye.on("click", function () {
        mThis.inputPassword.attr("type", "text");
        mThis.faeyeslash.css("display", "block");
        mThis.faeye.css("display", "none");
    })
    this.faeyeslash.on("click", function () {
        mThis.inputPassword.attr("type", "password");
        mThis.faeyeslash.css("display", "none");
        mThis.faeye.css("display", "block");
    })

    //RegisterAction
    this.RegisterAccount.off("click").on("click", function () {
        if ($("#firstName").val() == "" && $("#lastName").val() == "" && $("#dob").val() == "" && $("#email").val() == "" && $("#password").val() == "") {
            alertify.error("Fill the form first before Register Account");
            return;
        }
        else {
            var obj = {};
            obj.FirstName = mThis.firstName.val();
            obj.LastName = mThis.lastName.val();
            obj.DOB = $("#dob").val();
            obj.Email = $("#email").val();
            obj.Password = mThis.password.val();
            $.ajax({
                type: 'POST',
                url: '../../Testing/Register',
                data: obj,
                datatype: "JSON",
                success: function (data) {
                    if (data == "0") {
                        mThis.maincontent.show();
                        mThis.RegisterPage.hide();
                        mThis.IndexPage.hide();
                        alertify.success("Create Account Successed");
                    }
                }
            });

        }
    });
    this.RegisterLink.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.RegisterPage.show();

    });
    this.btnbackLogin.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.footer.hide();
        mThis.IndexPage.show();

    });
    this.Logoutfunction.off("click").on("click", function () {
        mThis.btnbackLogin.trigger("click");
        $("#maincontent").css("display", "none");
    });
    this.Profilefunction.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.Profile.show();
        var obj = {};
        obj.UserID = mThis.userid.text();
        obj.UserPosition = mThis.userposition.text();
        $.ajax({
            type: 'POST',
            url: '../../Testing/profile',
            data: obj,
            datatype: "JSON",
            success: function (data) {
                if (data == "0") {
                    alertify.error("Doesn't have this account!!!");
                }
                else {
                    mThis.FullName.val(data.fullName);
                    $("#dobtxt").val(data.DOB);
                    mThis.email.val(data.Email);
                }
            }
        });

    });
    this.btnbackprofile.off("click").on("click", function () {
        mThis.HomeTab.trigger("click");
    });



    this.HomeTab.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.HomeContainer.show();
    })


    this.FeatureTab.off("click").on("click", function () {
        mThis.Cleartify();
    })


    this.PricingTab.off("click").on("click", function () {
        // Code executed when PricingTab is clicked
        mThis.Cleartify();
        mThis.PricingContainer.show();

        // AJAX request to server-side endpoint
        $.ajax({
            type: 'POST',
            url: '../../Testing/Menu',
            datatype: "JSON",
            success: function (data) {
                if (data == "0") {
                    // Handle case when data is 0
                } else {
                    $(".food-column").html("");
                    for (var i = 0; i < data.length; i++) {
                        // Process received data and update UI
                        var foodName = data[i].namefood;
                        var foodPrice = data[i].price;
                        var foodImage = data[i].foodimage;

                        var ID = data[i].id;

                        // Create HTML elements to display food details
                        var foodItem = $('<div>').addClass('food-card');
                        var image = $('<img>').attr('src', '/image/menufood-copy/' + foodImage).addClass('food-image');
                        var foodDetails = $('<div>').addClass('food-details').html('<h4>' + foodName + '</h4><p>Price: ' + foodPrice + '$</p>');
                        var addToCartButton = $('<button>').addClass('btn btn-primary add-to-cart').text('Add to Cart');
                        addToCartButton.attr('data-id', ID);

                        var deleteButton = $('<button>').addClass('btn btn-danger deletecardfood').text('Delete');
                        deleteButton.attr('datadeletecard', ID);

                        var updateButton = $('<button>').addClass('btn btn-primary updatecardfood').text('Update');
                        updateButton.attr('dataupdatecard', ID);

                        // Append elements to the DOM
                        foodItem.append(image, foodDetails, addToCartButton, deleteButton, updateButton);
                        $('#food-items').append(foodItem);

                        if (mThis.userposition.text() == "Admin") {

                            $(".updatecardfood").css("display", "block");
                            $(".deletecardfood").css("display", "block");
                        }
                        else {

                            $(".updatecardfood").css("display", "none");
                            $(".deletecardfood").css("display", "none");
                        }
                        $(".add-to-cart").off("click").on("click", function () {
                            mThis.Cleartify();
                            $(".container-Order").css("display", "block");
                            var obj = {};
                            obj.DataIDCart = $(this).attr('data-id');
                            $.ajax({
                                type: 'POST',
                                url: '../../Testing/Order',
                                data: obj,
                                datatype: "JSON",
                                success: function (data) {
                                    if (data.length > 0) {
                                        var firstItem = data[0];
                                        mThis.pizzaimage.attr('src', '/image/menufood-copy/' + firstItem.FoodSrc);
                                        mThis.pizzaimage.attr('foodID', data[0].id);
                                        mThis.BtnPurchase.attr('purchaseID', data[0].id);
                                    }
                                }
                            });

                        })
                        $(".deletecardfood").on("click", function () {
                            obj = {};
                            obj.IDDeleteCart = $(this).attr('datadeletecard');
                            $.ajax({
                                type: 'POST',
                                url: '../../Testing/DeleteFoodCard',
                                data: obj,
                                datatype: "JSON",
                                success: function (data) {
                                    if (data == "1") {

                                    }
                                }
                            });
                        })
                        $(".updatecardfood").off("click").on("click", function () {
                            mThis.admindashboard.show();
                            mThis.PricingContainer.hide();
                            obj = {};
                            obj.IDUpdateCart = $(this).attr('dataupdatecard');
                            $.ajax({
                                type: 'POST',
                                url: '../../Testing/UpdateFoodCard',
                                data: obj,
                                datatype: "JSON",
                                success: function (data) {
                                    if (data == "0") {
                                        // Handle case when data is 0
                                    } else {
                                        mThis.Updatefooditem.css("display", "block");
                                        mThis.foodname.val(data.namefood);
                                        mThis.foodprice.val(data.price);
                                        mThis.idhide.text(data.id);
                                        $("#food-image").val(data.foodimage);

                                    }
                                }
                            });
                        })
                    }
                }
            }
        });
    });
    $("#AddItem").off("click").on("click", function () {
        mThis.Cleartify();
        mThis.admindashboard.show();

    })
    this.addfooditem.off("click").on("click", function () {
        mThis.containerOrder.hide();
        var obj = {};
        obj.FoodName = mThis.foodname.val();
        obj.FoodPrice = mThis.foodprice.val();

        // Create a new FormData object to store the form data, including the file
        var formData = new FormData();
        formData.append("foodImageFile", mThis.foodimage[0].files[0]);
        formData.append("FoodName", obj.FoodName);
        formData.append("FoodPrice", obj.FoodPrice);

        $.ajax({
            type: 'POST',
            url: '../../Testing/Dashboard',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data == "0") {
                    alertify.success("You have added food successfull");
                    mThis.foodname.val("");
                    mThis.foodprice.val("");
                }
            }
        });
    });
    this.Ordertaga.off("click").on("click", function () {
        mThis.PricingTab.trigger("click");
    })

    this.Updatefooditem.off("click").on("click", function () {
        var obj = {};
        obj.idFood = mThis.idhide.text();
        obj.FoodNames = mThis.foodname.val();
        obj.FoodPrices = mThis.foodprice.val();

        // Read the selected image file
        var fileInput = document.getElementById("food-image");

        // Create FormData object and append the data
        var formData = new FormData();
        formData.append("foodImageFileti2", mThis.foodimage[0].files[0]);
        formData.append("idFood", obj.idFood);
        formData.append("FoodNames", obj.FoodNames);
        formData.append("FoodPrices", obj.FoodPrices);

        // Send the data including the image to the server
        $.ajax({
            type: 'POST',
            url: '../../Testing/UpdateDataInCart',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                if (data == "1") {
                    alertify.success("Update Success");
                }
            }
        });
    });
    this.BtnPurchase.off("click").on("click", function () {
        if ($("#pizzaType").val() == "" && $("#pizzaSize").val() == "") {
            alertify.error("Fill The Form Before Make Order");
            return;
        }
        else {
            var obj = {};
            obj.userinformation = $("#userid").text();
            obj.TypeChoose = $("#pizzaType").val();
            obj.SizeChoose = $("#pizzaSize").val();
            obj.ToppingChoose = $("#toppings").val();
            obj.QuantityChoose = $("#quantity").val();
            obj.NoteChoose = $("#notes").val();
            obj.FoodID = $("#pizzaimage").attr("foodid");
            $.ajax({
                type: 'POST',
                url: '../../Testing/Checkout',
                data: obj,
                datatype: "JSON",
                success: function (data) {
                    alert("Great!You've selected the item let's move on to the next step");
                    spenum();
                    $("#pizzaType").prop('selectedIndex', 0);
                    $("#pizzaSize").prop('selectedIndex', 0);
                    $("#toppings").val("");
                    $("#notes").val("");

                }
            });
        }
    })

    this.iconpurchase.off("click").on("click", function () {
        mThis.Cleartify();
        mThis.PurchaseArea.show();

        var obj = {};
        obj.userid = $("#userid").text();
        $.ajax({
            type: 'POST',
            url: '../../Testing/Basket',
            data: obj,
            dataType: "json",
            success: function (data) {
                $("#PurchaseArea").html("");

                for (var i = 0; i < data.length; i++) {
                    // Process received data and update UI
                    var foodName = data[i].namefood;
                    var OrderID = data[i].OrderID;
                    var TotalPrice = data[i].TotalPrice;

                    // Create HTML elements to display food details
                    var foodItem = $('<div>').addClass('OrderBox');
                    var foodDetails = $('<div>').addClass('Order-details').html('<h4>You have ordered: <b>' + foodName + '</b></h4>');
                    var totalPriceText = $('<p>').html('Total Price: <b>' + TotalPrice + '$</b>');
                    var ContainControllBTN = $('<div>').addClass('containbtn');
                    var btnToPayment = $('<button>').addClass('btn btn-primary BtnToPayment').text('Payment').attr("OrderID", OrderID);
                    var clearBtn = $('<button>').addClass('btn btn-danger ClearBtnOrder').text('Clear').attr("OrderClearID", OrderID);
                    ContainControllBTN.append(btnToPayment, clearBtn);

                    foodItem.append(foodDetails, totalPriceText, ContainControllBTN);

                    $("#PurchaseArea").append(foodItem);
                }
            }
        });
        $(document).on("click", ".BtnToPayment", function () {
            mThis.Cleartify();
            mThis.PaymentContainer.show();
            $("#PurchaseArea").html("");
            var PaymentID = $(this).attr('orderid');
            mThis.OrderButton.attr("OrderID", PaymentID);
        })
        $(document).on("click", ".ClearBtnOrder", function () {

            $("#PurchaseArea").html("");
            var obj = {};
            obj.ClearOrderBox = $(this).attr('OrderClearID');
            $.ajax({
                type: 'POST',
                url: '../../Testing/ClearOrderBox',
                data: obj,
                datatype: "JSON",
                success: function (data) {
                    if (data == 1) {
                        mThis.iconpurchase.trigger("click");
                        spenum();
                    }

                }
            });
        });

    });


    this.OrderButton.off("click").on("click", function () {
        if ($("#phone").val() == "" && $("#address").val() == "" && $("#paymentMethod").val() == "") {
            alertify.error("Fill The Form Before Purchase");
            return;
        }
        else {
            var obj = {};
            obj.OrderID = mThis.OrderButton.attr("OrderID");
            obj.phone = $("#phone").val();
            obj.address = $("#address").val();
            obj.paymentMethod = $("#paymentMethod").val();
            $.ajax({
                type: 'POST',
                url: '../../Testing/PaymentBoxID',
                data: obj,
                datatype: "JSON",
                success: function (data) {
                    if (data == "1") {
                        mThis.Cleartify();
                        spenum();
                        $("#phone").val("");
                        $("#address").val("");
                        $("#paymentMethod").val("");
                        mThis.iconpurchase.trigger("click");
                        alertify.success("You have order Succesfully");
                    }

                }
            });
        }
    })
    
    var $table = $('#myTable')

    $('button[name="paginationSwitch"]').addClass('fa-solid fa-repeat btn btn-secondary');

    function initTable(data) {
        $table.bootstrapTable("destroy").bootstrapTable({
            height: 550,
            locale: $("#locale").val(),
            data: data,
            columns: [
                {
                    field: "id",
                    title: "ID",
                    align: "center",
                },
                {
                    field: "namefood",
                    title: "Food Name",
                    align: "center",
                },
                {
                    field: "Quantity",
                    title: "Quantity",
                    align: "center",
                },
                {
                    field: "OrderDate",
                    title: "Order Date",
                    align: "center",
                },
                {
                    field: "TotalPrice",
                    title: "Total Price",
                    align: "center",
                },
                {
                    field: "OrderID",
                    title: "Receipt",
                    align: "center",
                    formatter: function (value) {
                        return '<i class="fa-solid fa-2x fa-receipt" OrderReceiptId="' + value + '"></i>';
                    },
                },
            ],
        });
    }
    this.historybough.on("click", function () {
        mThis.Cleartify();
        mThis.tablehistoryorder.css("display", "block");
        var obj = {};
        obj.userid = $("#userid").text();
        $.ajax({
            type: 'POST',
            url: '../../Testing/HistoryTable',
            data: obj,
            dataType: "json",
            success: function (response) {
                console.log(response);
                initTable(response);
            },
            error: function (error) {
                console.log(error);
            }
        });
    });
    $(document).on("click", "td .fa-receipt", function () {
        var obj = {};
        obj.Reciept = $(this).attr('OrderReceiptId');
    });
}